//
//  Geo.m
//  DistanceCalculator
//
//  Created by Max on 13.05.17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "Geo.h"
#import <MapKit/MapKit.h>

id coalesce(id obj) {
  return nil != obj ? obj : [NSNull null];
}

@implementation Geo

RCT_EXPORT_MODULE(Geo);

-(NSDictionary*)locationFrom:(CLLocation*)location {
  if (!location) {
    return @{
             @"latitude": [NSNull null],
             @"longitude": [NSNull null],
    };
  }
  
  return @{
          @"latitude": @(location.coordinate.latitude),
          @"longitude" : @(location.coordinate.longitude),
  };
}

-(NSDictionary*)addressFrom:(CLPlacemark*)placemark {
  return @{
           @"country": coalesce(placemark.country),
           @"countryCode": coalesce(placemark.ISOcountryCode),
           @"postalCode": coalesce(placemark.postalCode),
           @"area": coalesce(placemark.administrativeArea),
           @"subArea": coalesce(placemark.subAdministrativeArea),
           @"locality": coalesce(placemark.locality),
           @"subLocality": coalesce(placemark.subLocality),
           @"street": coalesce(placemark.thoroughfare),
           @"subStreet": coalesce(placemark.subThoroughfare),
           };

}

RCT_EXPORT_METHOD(geocodeAddress:(NSString*)address completion:(RCTResponseSenderBlock)completion)
{
  [[[CLGeocoder alloc] init] geocodeAddressString:address
                                completionHandler:^(NSArray<CLPlacemark *> * _Nullable placemarks, NSError * _Nullable error) {
                                  
                                  NSMutableArray *points = [NSMutableArray new];
                                  
                                  for (CLPlacemark *mark in placemarks) {
                                    [points addObject:@{
                                                        @"location": [self locationFrom:mark.location],
                                                        @"address": [self addressFrom:mark]
                                                        }];
                                  }
                                  
                                  completion(@[
                                               nil == error ? [NSNull null] : error,
                                               points
                                               ]);
    
  }];
  
}


RCT_EXPORT_METHOD(requestRoutes:(NSArray*)points completion:(RCTResponseSenderBlock)completion)
{
  if (points.count < 2) {
    return completion(@[@{@"code": @(1), @"message": @"To request a route please provide at least 2 points."}]);
  }
  
  NSMutableArray<CLLocation*>* locations = [NSMutableArray new];
  
  for (NSDictionary* point in points) {
    NSDictionary* locationInfo = point[@"location"];
    if (!locationInfo) {
      return completion(@[@{@"code": @(2),
                            @"message": [NSString stringWithFormat:@"Point should have location key. Given (%@).", point]}]);
    }
    
    NSNumber* lat = locationInfo[@"latitude"];
    NSNumber* lon = locationInfo[@"longitude"];
    
    if (!lat || !lon) {
        return completion(@[@{
                              @"code": @(3),
                              @"message": [NSString stringWithFormat:@"Point location should have latitude and longitude keys. Given (%@).", point]}]);
    }
    
    CLLocation* location = [[CLLocation alloc] initWithLatitude:[lat doubleValue] longitude:[lon doubleValue]];
    [locations addObject:location];
  }
  
  MKPlacemark *startPlacemark = [[MKPlacemark alloc] initWithCoordinate:locations[0].coordinate];
  MKPlacemark *finishPlacemark = [[MKPlacemark alloc] initWithCoordinate:locations[1].coordinate];
  
  MKMapItem *startItem = [[MKMapItem alloc] initWithPlacemark:startPlacemark];
  MKMapItem *finishItem = [[MKMapItem alloc] initWithPlacemark:finishPlacemark];
  
  NSMutableArray* routesList = [NSMutableArray new];
  NSMutableArray<NSError*>* errors = [NSMutableArray new];
  
  
  dispatch_group_t asyncGroup = dispatch_group_create();
  
  NSArray* transportTypes = @[@(MKDirectionsTransportTypeAutomobile), @(MKDirectionsTransportTypeTransit), @(MKDirectionsTransportTypeWalking)];
  
  for (NSNumber* transportType in transportTypes) {
  
    dispatch_group_enter(asyncGroup);
    [self routeFrom:startItem to:finishItem withType:(MKDirectionsTransportType)[transportType intValue]
         completion:^(NSArray *routes, NSError *error) {
           
            if (error) {
              [errors addObject:error];
            }
           
            [routesList addObjectsFromArray:routes];
            dispatch_group_leave(asyncGroup);
    }];
  }

  dispatch_group_notify(asyncGroup, dispatch_get_main_queue(), ^{
    id error = [NSNull null];
    
    if (errors.count > 0) {
      NSError* firstError = errors.firstObject;
      NSString* message = firstError.localizedDescription;
      
      if ([firstError.domain isEqualToString:MKErrorDomain]) {
        switch (firstError.code) {
          case MKErrorServerFailure:
            message = @"Server failure.";
            break;
          case MKErrorLoadingThrottled:
            message = @"Too many requests.";
            break;
          case MKErrorPlacemarkNotFound:
            message = @"Point not found.";
            break;
          case MKErrorDirectionsNotFound:
            message = @"Route not found.";
            break;
          default:
            message = @"Unknown error.";
        }
      }
      
      error = @{
                  @"code": @(firstError.code),
                  @"message": message,
                  };
    }
    
    completion(@[error, routesList, errors]);
  });
  
}

// Better to add cancel possibility here
-(void)routeFrom:(MKMapItem*)source
              to:(MKMapItem*)destination
        withType:(MKDirectionsTransportType)type
      completion:(void(^)(NSArray* routes, NSError* error))completion {
  MKDirectionsRequest *routeRequest = [[MKDirectionsRequest alloc] init];
  routeRequest.transportType = type;
  routeRequest.requestsAlternateRoutes = YES;
  
  [routeRequest setSource:source];
  [routeRequest setDestination:destination];
  
//  NSLog(@"Route request: %@ %@", source, destination);
  
  MKDirections *directions = [[MKDirections alloc] initWithRequest:routeRequest];
  [directions calculateDirectionsWithCompletionHandler:^(MKDirectionsResponse * routeResponse, NSError *routeError) {
    if (routeError) {
      completion(@[], routeError);
    } else {
      
      NSMutableArray *routes = [NSMutableArray new];
      
      for (MKRoute *route in routeResponse.routes) {
        
        NSMutableDictionary *routeInfo = [NSMutableDictionary new];
        
        NSString *routeType;

        switch (route.transportType) {
          case MKDirectionsTransportTypeWalking:
            routeType = @"walk";
            break;
          case MKDirectionsTransportTypeAutomobile:
            routeType = @"auto";
            break;
          case MKDirectionsTransportTypeTransit:
            routeType = @"transit";
            break;
          default:
            routeType = @"unknown";
            break;
        }
        
        routeInfo[@"type"] = routeType;
        // meters
        routeInfo[@"distance"] = @(route.distance);
        // seconds
        routeInfo[@"time"] = @(route.expectedTravelTime);
        
        [routes addObject:routeInfo];
        
      }
      
      completion(routes, nil);
      
    }
  }];
}

@end

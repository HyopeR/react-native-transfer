#import "RNTransferUtils.h"

static NSString *name = @"RNTransfer";

@implementation RNTransferUtils

+ (NSString *)name {
    return name;
}

+ (void)setName:(NSString *)_name {
    name = _name;
}

+ (void)reset {
    name = @"RNTransfer";
}

@end

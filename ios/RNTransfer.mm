#import "RNTransfer.h"
#import "RNTransferUtils.h"

@interface RNTransfer ()

@end

@implementation RNTransfer

+ (NSString *)moduleName {
    return @"RNTransfer";
}

- (instancetype)init {
    if (self = [super init]) {
        [RNTransferUtils setName:[[self class] moduleName]];
    }
    return self;
}

- (void)dealloc {
    [RNTransferUtils reset];
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
    return std::make_shared<facebook::react::NativeRNTransferSpecJSI>(params);
}

@end


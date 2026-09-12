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

- (NSArray *)getDownloads
{
    return nil;
}

- (NSNumber *)clearDownloads
{
    return @NO;
}

- (NSDictionary *)getDownload:(NSString *)identifier
{
    return nil;
}

- (NSDictionary *)createDownload:(JS::NativeRNTransfer::DownloadOptions &)options
{
    return nil;
}

- (NSDictionary *)removeDownload:(NSString *)identifier
{
    return nil;
}

- (void)startDownload:(NSString *)identifier
{
}

- (void)stopDownload:(NSString *)identifier
{
}

- (NSArray *)getUploads
{
    return nil;
}

- (NSNumber *)clearUploads
{
    return @NO;
}

- (NSDictionary *)getUpload:(NSString *)identifier
{
    return nil;
}

- (NSDictionary *)createUpload:(JS::NativeRNTransfer::UploadOptions &)options
{
    return nil;
}

- (NSDictionary *)removeUpload:(NSString *)identifier
{
    return nil;
}

- (void)startUpload:(NSString *)identifier
{
}

- (void)stopUpload:(NSString *)identifier
{
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
    return std::make_shared<facebook::react::NativeRNTransferSpecJSI>(params);
}

@end


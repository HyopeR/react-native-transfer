require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name           = "RNTransfer"
  s.version        = package["version"]
  s.summary        = package["description"]
  s.description    = package["description"]
  s.author         = package["author"]
  s.license        = package["license"]
  s.homepage       = package["homepage"]

  s.source         = { :git => "https://github.com/hyoper/react-native-transfer.git", :tag => "#{s.version}" }
  s.platforms      = { :ios => "13.0" }
  s.source_files   = "ios/**/*.{h,m,mm}"
  s.requires_arc   = true

  s.dependency 'MMKV', "2.4.2"

  install_modules_dependencies(s);
end


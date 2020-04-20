# Change Log

## v1.0.6
### Changed
- 增加是否开启changelog选项, 不填则不开启

## v1.0.5
### Changed
- get方法 入参interface 类型为string | number

## v1.0.4
### Added
- 查看版本号 `yfeapi2ts version`



## v1.0.3
### Added
- 增加 catid exclude、include 参数
- 文件名生成方式可自定义
```
generateApiName: (path, _id) => {
  return `Id${_id}`
}
```


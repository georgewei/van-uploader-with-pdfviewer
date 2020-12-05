import _ from 'lodash'

function MergeOnNull(objValue, srcValue) {
  // if a property of objValue is null, set it to srcValue
  if (objValue == null) {
    return srcValue;
  }
  // if both objValue and srcValue are objects but not arrays, merge them recursively
  if (!_.isArray(objValue) && _.isObject(objValue) && _.isObject(srcValue)) {
    return _.mergeWith(objValue, srcValue, MergeOnNull);
  }
  // else merge them by default
  return objValue;
}

/**
* 使用源对象的属性初始化目标对象
* 本方法与lodash.defaultsDeep类似，但当目标对象的属性为null时初始化为源对象的同名属性
* @param {Object} object 需要初始化的对象
* @param {...Object} sources 初始化属性的源对象
*/
export function defaultsDeep(object, sources) {
  if (_.isArray(sources)) {
    return _.mergeWith(object, ...sources, MergeOnNull);
  }
  return _.mergeWith(object, sources, MergeOnNull);
}

/**
 * 根据文件扩展名判断文件是不是图片
 */
export function isImage(filename) {
  const IMAGE_REGEXP = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg)$/i;
  return IMAGE_REGEXP.test(filename);
}

/**
 * 根据文件扩展名判断文件是不是PDF文件
 */
export function isPdf(filename) {
  const PDF_REGEXP = /\.pdf$/i;
  return PDF_REGEXP.test(filename);
}

/**
 * 获取指定文件的文件扩展名
 * @param {String} filename 文件名
 */
export function getFileExtension(filename) {
  if (filename) {
    let index = filename.lastIndexOf('/');
    if (index >= 0) {
      filename = filename.substr(index + 1);
    }
    index = filename.lastIndexOf('.');
    if (index >= 0) {
      return filename.substr(index + 1);
    }
  }
  return '';
}

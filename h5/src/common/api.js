import axios from 'axios'
import qs from 'qs'
import _this from '../main'
import common from './common'

// 需要登陆的，都写到这里，否则就是不需要登陆的接口
let methodToken = [
    'user.info',
    'user.editinfo',
    'user.changeavatar',
    'user.logout',
    'user.addgoodsbrowsing',
    'user.delgoodsbrowsing',
    'user.goodsbrowsing',
    'user.goodscollection',
    'user.goodscollectionlist',
    'user.saveusership',
    'user.vuesaveusership',
    'user.getshipdetail',
    'user.setdefship',
    'user.editship',
    'user.removeship',
    'user.getusership',
    'user.pay',
    'user.orderevaluate',
    'user.getuserdefaultship',
    'user.issign',
    'user.sign',
    'user.mypoint',
    'user.pointlog',
    'user.getbankcardlist',
    'user.getdefaultbankcard',
    'user.addbankcard',
    'user.removebankcard',
    'user.setdefaultbankcard',
    'user.getbankcardinfo',
    'user.editpwd',
    'user.forgotpwd',
    'user.recommend',
    'user.balancelist',
    'user.sharecode',
    'user.cash',
    'user.cashlist',
    'coupon.getcoupon',
    'coupon.usercoupon',
    'cart.add',
    'cart.del',
    'cart.getlist',
    'cart.setnums',
    'order.cancel',
    'order.del',
    'order.details',
    'order.confirm',
    'order.getlist',
    'order.create',
    'order.getship',
    'order.getorderlist',
    'order.getorderstatusnum',
    'order.aftersaleslist',
    'order.aftersalesinfo',
    'order.aftersalesstatus',
    'order.addaftersales',
    'order.sendreship',
    'order.iscomment',
    'payments.getinfo',
    'user.getuserpoint',
    'coupon.getcouponkey',
    'store.isclerk'
];

// api接口地址
const ApiUrl = () => {
    let apiUrl;
    if (process.env.NODE_ENV === 'development') {
        // 开发环境
        apiUrl = 'http://www.b2c.com/api.html'
        // apiUrl = 'https://b2c.jihainet.com/api.html'
        // apiUrl = 'http://wjima.ngrok.jihainet.com/api.html'
    } else if (process.env.NODE_ENV === 'production') {
        // 生产环境
        if (!window.apiUrl) common.errorToBack('缺少配置参数!');
        apiUrl = window.apiUrl
    }
    return apiUrl
};

// 接口token验证
const post = (method, data, callback) => {
    // 如果是需要登陆的，增加token
    if (methodToken.indexOf(method) >= 0) {
        data.token = common.getStorage('user_token')
    }
    data.method = method;
    sendPost(ApiUrl(), qs.stringify(data), {}, callback)
};

// 图片上传
const uploadFile = (type, param, callback) => {
    if (type === 'image') {
        param.append('method', 'images.upload')
    } else if (type === 'video') {
        param.append('method', 'videos.addvideo')
    }
    let config1 = {
        headers: { 'Content-Type': 'multipart/form-data' }
    };
    sendPost(ApiUrl(), param, config1, callback)
};

// axios 发送请求统一处理
const sendPost = (url, data, config = {}, callback) => {
    // _this.$dialog.loading.open(Object.keys(config).length ? '上传中...' : '加载中...')
    axios.post(url, data, config).then(response => {
        // _this.$dialog.loading.close()
        if (!response.data.status) {
            // 输出错误显示
            common.errorToBack(response.data.msg);
            if (response.data.data === 14007 || response.data.data === 14006) {
                // 用户未登录或者token过期 清空本地user_token
                common.removeStorage('user_token');
                    // 跳转至登录
                common.jumpToLogin()
            }
        }
        callback(response.data)
    }).catch(err => {
        if (err && err.response) {
            switch (err.response.status) {
                case 400:
                    err.message = '请求参数错误';
                    break;
                case 401:
                    err.message = '未授权，请登录';
                    break;
                case 403:
                    err.message = '跨域拒绝访问';
                    break;
                case 404:
                    err.message = `请求地址出错: ${err.response.config.url}`;
                    break;
                case 408:
                    err.message = '请求超时';
                    break;
                case 500:
                    err.message = '服务器内部错误';
                    break;
                case 501:
                    err.message = '服务未实现';
                    break;
                case 502:
                    err.message = '网关错误';
                    break;
                case 503:
                    err.message = '服务不可用';
                    break;
                case 504:
                    err.message = '网关超时';
                    break;
                case 505:
                    err.message = 'HTTP版本不受支持';
                    break;
                default:
                    break;
            }
            _this.$dialog.loading.close();
            common.errorToBack(err.message)
        }
    })
};

// 用户注册
const reg = (data, callback) => post('user.reg', data, callback);

// 用户登录
const login = (data, callback) => post('user.login', data, callback);

// 用户信息
const userInfo = (data, callback) => post('user.info', data, callback);

// 上传头像
const changeAvatar = (data, callback) => post('user.changeavatar', data, callback);

// 编辑用户信息
const editInfo = (data, callback) => post('user.editinfo', data, callback);

// 发送短信验证码
const sms = (data, callback) => post('user.sms', data, callback);

// 短信验证码登录
const smsLogin = (data, callback) => post('user.smslogin', data, callback);

// 退出登录
const logout = (data, callback) => post('user.logout', data, callback);

// 获取首页幻灯片
const slider = (data, callback) => post('advert.getAdvertList', data, callback);

// 获取公告列表
const notice = (data, callback) => post('notice.noticeList', data, callback);

// 获取公告详情
const noticeInfo = (data, callback) => post('notice.noticeInfo', data, callback);

// 获取文章详情
const articleInfo = (data, callback) => post('articles.getArticleDetail', data, callback);

// 获取文章列表
const articleList = (data, callback) => post('articles.getArticleList', data, callback);

// 获取商品分类
const categories = (data, callback) => post('categories.getallcat', data, callback);

// 获取商品列表
const goodsList = (data, callback) => post('goods.getlist', data, callback);

// 获取商品详情
const goodsDetail = (data, callback) => post('goods.getdetial', data, callback);

// 获取商品参数信息
const goodsParams = (data, callback) => post('goods.getgoodsparams', data, callback);

// 获取设置默认货品
const getProductInfo = (data, callback) => post('goods.getproductinfo', data, callback);

// 获取商品评论信息
const goodsComment = (data, callback) => post('goods.getgoodscomment', data, callback);

// 添加购物车
const addCart = (data, callback) => post('cart.add', data, callback);

// 移除购物车
const removeCart = (data, callback) => post('cart.del', data, callback);

// 获取购物车列表
const cartList = (data, callback) => post('cart.getlist', data, callback);

// 设置购物车商品数量
const setCartNum = (data, callback) => post('cart.setnums', data, callback);

// 获取用户的收货地址列表
const userShip = (data, callback) => post('user.getusership', data, callback);

// 获取用户默认收货地址
const userDefaultShip = (data, callback) => post('user.getuserdefaultship', data, callback);

// 存储用户收货地址
const saveUserShip = (data, callback) => post('user.vuesaveusership', data, callback);

// 获取收货地址详情
const shipDetail = (data, callback) => post('user.getshipdetail', data, callback);

// 收货地址编辑
const editShip = (data, callback) => post('user.editship', data, callback);

// 收货地址删除
const removeShip = (data, callback) => post('user.removeship', data, callback);

// 设置默认收货地址
const setDefShip = (data, callback) => post('user.setdefship', data, callback);

// 生成订单
const createOrder = (data, callback) => post('order.create', data, callback);

// 获取状态订单列表
const getOrderList = (data, callback) => post('order.getlist', data, callback);

// 取消订单
const cancelOrder = (data, callback) => post('order.cancel', data, callback);

// 删除订单
const delOrder = (data, callback) => post('order.del', data, callback);

// 获取订单详情
const orderDetail = (data, callback) => post('order.details', data, callback);

// 确认收货
const confirmOrder = (data, callback) => post('order.confirm', data, callback);

// 获取配送方式
const orderShip = (data, callback) => post('order.getship', data, callback);

// 获取全部订单列表
const orderList = (data, callback) => post('order.getorderlist', data, callback);

// 获取订单不同状态的数量
const getOrderStatusSum = (data, callback) => post('order.getorderstatusnum', data, callback);

// 售后单列表
const afterSalesList = (data, callback) => post('order.aftersaleslist', data, callback);

// 售后单详情
const afterSalesInfo = (data, callback) => post('order.aftersalesinfo', data, callback);

// 订单售后状态
const afterSalesStatus = (data, callback) => post('order.aftersalesstatus', data, callback);

// 添加售后单
const addAfterSales = (data, callback) => post('order.addaftersales', data, callback);

// 用户发送退货包裹
const sendShip = (data, callback) => post('order.sendreship', data, callback);

// 添加商品浏览足迹
const addGoodsBrowsing = (data, callback) => post('user.addgoodsbrowsing', data, callback);

// 删除商品浏览足迹
const delGoodsBrowsing = (data, callback) => post('user.delgoodsbrowsing', data, callback);

// 获取商品浏览足迹
const goodsBrowsing = (data, callback) => post('user.goodsbrowsing', data, callback);

// 商品收藏 关注/取消
const goodsCollection = (data, callback) => post('user.goodscollection', data, callback);

// 获取商品收藏关注列表
const goodsCollectionList = (data, callback) => post('user.goodscollectionlist', data, callback);

// 获取店铺支付方式列表
const paymentList = (data, callback) => post('payments.getlist', data, callback);

// 获取支付单详情
const paymentInfo = (data, callback) => post('payments.getinfo', data, callback);

// 支付接口
const pay = (data, callback) => post('user.pay', data, callback);

// 订单评价接口
const orderEvaluate = (data, callback) => post('user.orderevaluate', data, callback);

// 判断是否签到
const isSign = (data, callback) => post('user.issign', data, callback);

// 签到接口
const sign = (data, callback) => post('user.sign', data, callback);

// 我的积分
const myPoint = (data, callback) => post('user.mypoint', data, callback);

// 积分记录
const pointLog = (data, callback) => post('user.pointlog', data, callback);

// 物流信息接口
const logistics = (data, callback) => post('order.logisticbyapi', data, callback);

// 优惠券列表
const couponList = (data, callback) => post('coupon.couponlist', data, callback);

// 优惠券详情
const couponDetail = (data, callback) => post('coupon.coupondetail', data, callback);

// 用户领取优惠券
const getCoupon = (data, callback) => post('coupon.getcoupon', data, callback);

// 用户已领取的优惠券列表
const userCoupon = (data, callback) => post('coupon.usercoupon', data, callback);

// 获取店铺设置
const getSetting = (data, callback) => post('user.getsetting', data, callback);

// 获取商户配置信息
const getSellerSetting = (data, callback) => post('user.getsellersetting', data, callback);

// 获取我的银行卡列表
const getBankCardList = (data, callback) => post('user.getbankcardlist', data, callback);

// 获取默认的银行卡
const getDefaultBankCard = (data, callback) => post('user.getdefaultbankcard', data, callback);

// 添加银行卡
const addBankCard = (data, callback) => post('user.addbankcard', data, callback);

// 删除银行卡
const removeBankCard = (data, callback) => post('user.removebankcard', data, callback);

// 设置默认银行卡
const setDefaultBankCard = (data, callback) => post('user.setdefaultbankcard', data, callback);

// 获取银行卡信息
const getBankCardInfo = (data, callback) => post('user.getbankcardinfo', data, callback);

// 获取银行卡组织信息
const getBankCardOrganization = (data, callback) => post('user.getbankcardorganization', data, callback);

// 用户修改密码
const editPwd = (data, callback) => post('user.editpwd', data, callback);

// 用户找回密码
const forgotPwd = (data, callback) => post('user.forgotpwd', data, callback);

// 获取用户余额明细
const getBalanceList = (data, callback) => post('user.balancelist', data, callback);

// 用户推荐列表
const recommendList = (data, callback) => post('user.recommend', data, callback);

// 邀请码
const shareCode = (data, callback) => post('user.sharecode', data, callback);

// 用户提现
const userToCash = (data, callback) => post('user.cash', data, callback);

// 用户提现列表
const cashList = (data, callback) => post('user.cashlist', data, callback);

// 获取授权登录方式
const getTrustLogin = (data, callback) => post('user.gettrustlogin', data, callback);

// 绑定授权登录
const trustBind = (data, callback) => post('user.trustbind', data, callback);

// 获取用户信息
const trustLogin = (data, callback) => post('user.trustcallback', data, callback);

// 判断用户下单可以使用多少积分
const usablePoint = (data, callback) => post('user.getuserpoint', data, callback);

// 门店列表
const storeList = (data, callback) => post('store.getstorelist', data, callback);

// 判断是否开启门店自提
const switchStore = (data, callback) => post('store.getstoreswitch', data, callback);

// 获取默认的门店
const defaultStore = (data, callback) => post('store.getdefaultstore', data, callback);

// 判断是否开启积分
const isPoint = (data, callback) => post('user.ispoint', data, callback);

// 用户输入code领取优惠券
const couponKey = (data, callback) => post('coupon.getcouponkey', data, callback)

// 判断是否是店员
const isStoreUser = (data, callback) => post('store.isclerk', data, callback)

export default {
    reg: reg,
    login: login,
    sms: sms,
    userInfo: userInfo,
    changeAvatar: changeAvatar,
    editInfo: editInfo,
    smsLogin: smsLogin,
    notice: notice,
    noticeInfo: noticeInfo,
    logout: logout,
    sliderHeader: slider,
    categories: categories,
    goodsList: goodsList,
    goodsDetail: goodsDetail,
    goodsParams: goodsParams,
    goodsComment: goodsComment,
    getProductInfo: getProductInfo,
    addCart: addCart,
    articleInfo: articleInfo,
    removeCart: removeCart,
    cartList: cartList,
    setCartNum: setCartNum,
    userShip: userShip,
    userDefaultShip: userDefaultShip,
    saveUserShip: saveUserShip,
    shipDetail: shipDetail,
    editShip: editShip,
    removeShip: removeShip,
    setDefShip: setDefShip,
    createOrder: createOrder,
    orderList: orderList,
    getOrderList: getOrderList,
    cancelOrder: cancelOrder,
    delOrder: delOrder,
    orderDetail: orderDetail,
    confirmOrder: confirmOrder,
    orderShip: orderShip,
    sendShip: sendShip,
    getOrderStatusSum: getOrderStatusSum,
    afterSalesList: afterSalesList,
    afterSalesInfo: afterSalesInfo,
    afterSalesStatus: afterSalesStatus,
    addAfterSales: addAfterSales,
    addGoodsBrowsing: addGoodsBrowsing,
    delGoodsBrowsing: delGoodsBrowsing,
    goodsBrowsing: goodsBrowsing,
    goodsCollection: goodsCollection,
    goodsCollectionList: goodsCollectionList,
    pay: pay,
    paymentList: paymentList,
    paymentInfo: paymentInfo,
    orderEvaluate: orderEvaluate,
    isSign: isSign,
    sign: sign,
    myPoint: myPoint,
    pointLog: pointLog,
    logistics: logistics,
    couponList: couponList,
    couponDetail: couponDetail,
    getCoupon: getCoupon,
    userCoupon: userCoupon,
    uploadFile: uploadFile,
    getSetting: getSetting,
    getSellerSetting: getSellerSetting,
    getBankCardList: getBankCardList,
    getDefaultBankCard: getDefaultBankCard,
    addBankCard: addBankCard,
    removeBankCard: removeBankCard,
    setDefaultBankCard: setDefaultBankCard,
    getBankCardInfo: getBankCardInfo,
    shareCode: shareCode,
    recommendList: recommendList,
    editPwd: editPwd,
    forgotPwd: forgotPwd,
    getBankCardOrganization: getBankCardOrganization,
    getBalanceList: getBalanceList,
    userToCash: userToCash,
    cashList: cashList,
    articleList: articleList,
    post: post,
    getTrustLogin: getTrustLogin,
    trustBind: trustBind,
    trustLogin: trustLogin,
    isPoint: isPoint,
    usablePoint: usablePoint,
    switchStore: switchStore,
    couponKey: couponKey,
    defaultStore: defaultStore,
    storeList: storeList,
    isStoreUser: isStoreUser
}

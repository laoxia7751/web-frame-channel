/* eslint-disable no-undef */
/* eslint-disable class-methods-use-this */

class FrameChannel {
    constructor() {
        /** 角色信息 */
        this.roles = {}
        /** 链接状态 */
        this.checkLinkStatus = false
    }

    /** 获取当前tab页的初始化信息 */
    #getRoleData(roleName) {
        const role = roleName || window.sessionStorage.getItem('FrameChannelRole')
        return this.roles[role]
    }

    init(options = {}) {
        window.FrameChannelDebug = this
        const { port, hostname, protocol } = window.location
        const defaultUrl = `${protocol}//${hostname}${port ? `:${port - 1}` : ''}`
        window.FrameChannel = new BroadcastChannel('FRAME_CHANNEL')
        const { role = 'main', url = defaultUrl } = options
        this.roles[role] = { role, url, ...options }
        window.sessionStorage.setItem('FrameChannelRole', role)
        window.addEventListener('message', ({ data }) => {
            if (data?._origin !== 'FrameChannel') return
            if (data.scene === 'cacheData') {
                if (role !== data.from && data.cacheData) {
                    // prettier-ignore
                    Object.entries(data.cacheData).forEach(([k,v]) => localStorage.setItem([k], typeof v === 'object' ? JSON.stringify(v) : `${v}`))
                }
            } else if (data.scene === 'checkPageHasOpen') {
                window.FrameChannel.postMessage({
                    role,
                    scene: 'openPage',
                    _origin: 'FrameChannel'
                })
            } else if (data.scene === 'replyOpenStatus') {
                this.checkLinkStatus = true
            }
        })
        window.FrameChannel.onmessage = (msg) => {
            if (msg.data?.scene === 'openPage') {
                window.FrameChannel.postMessage({
                    role,
                    scene: 'replyOpenStatus',
                    _origin: 'FrameChannel'
                })
                setTimeout(() => {
                    window.location.href = window.location.origin
                })
            } else if (msg.data?.scene === 'replyOpenStatus') {
                // eslint-disable-next-line no-unused-expressions
                window.top?.postMessage(
                    {
                        role,
                        _origin: 'FrameChannel',
                        scene: 'replyOpenStatus'
                    },
                    url
                )
            }
        }
    }

    emit(data, role) {
        if (Object.prototype.toString.call(data) !== '[object Object]') {
            throw new Error('消息格式错误')
        }
        const config = this.#getRoleData(role)
        if (!config) {
            throw new Error(role ? `未获取到${role}配置信息` : '未初始化')
        }
        if (config.frameName) {
            const oI = document.getElementById(config.frameName)
            // prettier-ignore
            oI.contentWindow.postMessage({ cacheData:data,scene: 'cacheData', from: config.role, _origin: 'FrameChannel' },config.url);
            return true
        }
        const that = this
        return new Promise((resolve) => {
            const oI = document.createElement('iframe')
            const frameName = `${config.role}_${Date.now().toString(36)}`
            oI.setAttribute('id', frameName)
            oI.setAttribute('width', 0)
            oI.setAttribute('height', 0)
            oI.setAttribute('src', config.url)
            oI.style.display = 'none'
            document.body.appendChild(oI)
            that.roles[config.role].frameName = frameName
            oI.onload = () => {
                // prettier-ignore
                oI.contentWindow.postMessage({scene: 'cacheData',cacheData: data,from: config.role,_origin: 'FrameChannel'}, config.url);
                resolve(true)
            }
        })
    }

    openPage() {
        const config = this.#getRoleData()
        const oI = document.getElementById(config.frameName)
        if (!oI) {
            throw new Error('通信频道链接失败')
        }
        oI.contentWindow.postMessage({ scene: 'checkPageHasOpen', from: config.role, _origin: 'FrameChannel' }, config.url)
        setTimeout(() => {
            if (!this.checkLinkStatus) {
                window.open(config.url)
            }
        }, 1000)
    }

    closeChannel() {
        const config = this.#getRoleData()
        if (config?.frameName) {
            const oI = document.getElementById(config.frameName)
            oI && document.body.removeChild(oI)
        }
        this.checkLinkStatus = false
    }
}

export default new FrameChannel()

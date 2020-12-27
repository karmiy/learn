## ActivityIndicator

显示一个圆形的 loading 提示符号

注意，即使 animating 为 false 将其隐藏，也会占高度

- animating: 相当于 visible

- color: 颜色，没有设置是透明的

- size: 'small', 'large', number

## Button

按钮，样式是固定的，需要自定义可以使用 TouchableOpacity

- onPress: 相当于 H5 的 onClick

- title: 相当于 H5 的 children

- color: 按钮颜色

- disabled: 是否禁用

## FlatList

高性能的简单列表组件

基于 VirtualizedList 的封装，继承其所有 props，也包括 ScrollView 的 props

需要注意：

- 当某行滑出渲染区域，状态是不会保留的，因为该组件只渲染视图内的

- FlatList 自带超出滚动，不要在外面包 ScrollView，会出问题

```tsx
const App: React.FC = () => {
    const [list, setList] = useState(
        [...Array(20).keys()].map((index) => {
            return {
                id: index,
                name: 'K' + index,
            };
        }),
    );
    return (
        <View>
            <View style={styles.wrap}>
                <View>
                    <FlatList
                        data={list}
                        renderItem={({item}) => {
                            return (
                                <View style={styles.item}>
                                    <Text>{item.name}</Text>
                                </View>
                            );
                        }}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrap: {
        width: 300,
        height: 300,
        marginTop: 40,
        marginLeft: 10,
        borderWidth: 1,
        borderColor: 'pink',
    },
    item: {
        height: 70,
        backgroundColor: 'red',
    },
});
```

### 常用 Props

- data: 数据列表

- renderItem({ item, index, separators }): 渲染每一项，data 中的数据将会循环执行 renderItem

    - item: data 循环时里项

    - index: 序号

    - separators: 用于操作分割组件

        - highlight: 函数，执行后分割组件接收到 highlighted prop 将会是 true

        - unhighlight: 函数，执行后分割组件接收到 highlighted prop 将会是 false

        - updateProps(select: 'leading' | 'trailing', newProps): 更新分割组件，并传递指定的 newProps 给它，select 似乎是更新时机的配置

```tsx
const App: React.FC = () => {
    const [list, setList] = useState(
        [...Array(20).keys()].map((index) => {
            return {
                id: index,
                name: 'K' + index,
            };
        }),
    );

    const Separator: React.FC<{highlighted: boolean; id: number}> = (props) => {
        const {highlighted, id} = props;
        return (
            <Text>
                分割线 {id} {highlighted ? '亮' : '暗'}
            </Text>
        );
    };

    return (
        <View>
            <View style={styles.wrap}>
                <View>
                    <FlatList
                        data={list}
                        renderItem={({item, index, separators}) => {
                            return (
                                <View>
                                    <Text onPress={separators.highlight}>
                                        高亮分割线{index}
                                    </Text>
                                    <Text
                                        onPress={() =>
                                            separators.updateProps('leading', {
                                                id: 100,
                                            })
                                        }>
                                        更新分割组件 props.id 为 100
                                    </Text>
                                    <Item name={item.name} />
                                </View>
                            );
                        }}
                        ItemSeparatorComponent={Separator}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrap: {
        width: 300,
        height: 300,
        marginTop: 40,
        marginLeft: 10,
        borderWidth: 1,
        borderColor: 'pink',
    },
    item: {
        height: 70,
        backgroundColor: 'red',
    },
});
```

- ItemSeparatorComponent: 分割组件，不会出现在列表第一行之前和最后一行之后

- ListEmptyComponent: data 没有数据时将渲染该组件

- ListFooterComponent: 将渲染在组件底部

- ListHeaderComponent: 将渲染在组件头部

- extraData: 传递给 extraData 的数据改变会让组件刷新，否则在 renderItem，头部、底部等代码里用到其他状态，由于组件 PureComponent 的原因，可能会有不刷新视图的问题

```tsx
const [count, setCount] = useState(0);

<FlatList
    data={list}
    renderItem={() => {
        // ...
        // 用到了 count，要把它放到 extraData，否则可能 count 改变时有不刷新视图的问题
        return <Text>{count}</Text>;
    }}
    // count 变化时提醒组件 render 更新视图
    extraData={count}
/>
```

- getItemLayout: 手动高度 RN 内容的尺寸，不仅可以节省测量内容尺寸的开销，还使得 RN 可以做到某些功能（初始滚到某个位置、滚到渲染区域外的位置等），通常在每一项高度一致的情况下都要使用它（如果指定分割线，记得一起算进来）

```tsx
getItemLayout={(data, index) => (
    {length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index}
)}
```

- horizontal: 变成水平布局

- initialNumToRender: 指定一开始渲染的元素数量，最好刚刚够填满一个屏幕，这样保证了用最短的时间给用户呈现可见的内容（性能优化的一种方案，如果指定少了，效果会是立即渲染出指定数量后再闪一下补空）。注意这第一批次渲染的元素不会在滑动过程中被卸载，这样是为了保证用户执行返回顶部的操作时，不需要重新渲染首批元素

- initialScrollIndex: 初始化时自动滚到指定 index 的位置，需要设置 getItemLayout 属性（不设的话好像初始上面元素会没掉，直接滚动条置顶了）

- inverted: 翻转滚动方向。实质是将 scale 变换设置为 -1

- keyExtractor(item: object, index: number) => string: 指定 Item 的 key，默认取 item.key，没有则取数组下标


- onEndReachedThreshold: 阈值，决定距离底部多远时触发 onEndReached 回调，该参数的值是 0 - 1，如 0.5 是距离底部距离一半

- onEndReached(info: {distanceFromEnd: number}) => void: 滚到离底部 onEndReachedThreshold 时会触发该回调（滚上去又滚下来到阈值也会，不是只触发一次），distanceFromEnd 是触发时离底部的距离，此回调是异步调用的，即滚的越快，触发的会越晚，触发时 distanceFromEnd 的值会越小

- onRefresh: 会在列表头部添加一个 RefreshControl 控件，实现下拉刷新，即下拉后的回调（先滚到到顶，再下拉，并不是正常滚动滚到负值，一定要在 scrollTop 0 的时候再重新拉一下才算），需要配合 refreshing 属性

- refreshing: 下拉刷新时，等待加载新数据则设为 true，加载后设为 false:

```tsx
const App: FC<{}> = () => {
    const [list, setList] = useState(
        [...Array(20).keys()].map((index) => {
            return {
                id: index,
                name: 'K' + index,
            };
        }),
    );
    const [refreshing, setRefreshing] = useState(false);
    return (
        <View>
            <View style={styles.wrap}>
                <FlatList
                    keyExtractor={(item, index) => index + ''}
                    data={list}
                    renderItem={({item, index, separators}) => {
                        return <Item name={item.name} />;
                    }}
                    refreshing={refreshing}
                    onRefresh={() => {
                        setRefreshing(true);
                        console.log(111);

                        setTimeout(() => {
                            setRefreshing(false);
                        }, 1000);
                    }}
                />
            </View>
        </View>
    );
};
```

- progressViewOffset: 设置 RefreshControl 下拉加载指示器的位置

- viewabilityConfig: 可以用来做曝光，元素可见时会触发 onViewableItemsChanged 回调，有如下几个配置项:

    - minimumViewTime: 回调触发前，一个 item 必须的最小物理可见时间，没有达到这个时间，就不会触发回调了，所以滚的快的话可能或错过一些 item 的曝光

    - viewAreaCoveragePercentThreshold: item 占滚到窗口的比例（0 - 100），如果滚动窗口 300 高，那 viewAreaCoveragePercentThreshold 50 即 item 滚到占据窗口 150 的地方，如果 item 完全暴露都不能达到窗口指定大小，那么在完全暴露也会触发

    - itemVisiblePercentThreshold: 与 viewAreaCoveragePercentThreshold 不同的是，该配置是 item 暴露的比例（0 - 100），更适合做曝光
    
    - waitForInteraction: 如果配为 true，一开始列表渲染完毕后出现在窗口内的也不会触发回调（做埋点的话要配 false，否则一开始就在窗口内的会不曝光）

- onViewableItemsChanged: 可见行元素变化的回调（元素变为可见/不可见都会调用）

```tsx
onViewableItemsChanged={info => {
    const { changed, viewabilityConfig, viewableItems } = info;

    // changed: 变化的项，是数组，如第 5 项变为可见时 [{ index: 4, item: xxx, key: '4', isViewable: true }]

    // viewabilityConfig: 配置的 viewabilityConfig 内容

    // viewableItems: 窗口内当前可见的项
}}
```

### 方法

将 ref 挂载到 FlatList 获取组件实例

- scrollToEnd(params: object): 滚到底部，不能在 useEffect 里立即执行，会无效，可能需要延迟

    - animated: 滚动画时是否动画，默认 true

- scrollToIndex(params: object): 滚动到指定 index 项位置，需要设置 getItemLayout 才能滚到渲染外的位置

    - animated: 滚动画时是否动画，默认 true

    - index: 必须，滚到第一项

    - viewOffset: 滚动指定位置后的多少偏移量，如 50 是滚到指定位置上方 50 的位置，需要要滚得更下去，应该是负值 -50

    - viewPosition: 0 - 1，如 index 3 滚到第 4 项，viewPosition 0.5 则滚到起点和第 4 项的中间，viewPosition 为 0 则滚到第 4 项的位置，viewPosition 为 1 还是在起始点

> 注：需要设置 getItemLayout 才能滚到渲染外的位置

- scrollToItem(params: object): 滚动到指定 item 位置，需要设置 getItemLayout 才能滚到渲染外的位置

    - animated: 滚动画时是否动画，默认 true

    - item: 滚到的项，如 list\[4]

    - viewPosition: 同 scrollToIndex

- scrollToOffset(params: object): 滚动列表到指定的偏移，等同于ScrollView的scrollTo方法

    - animated: 滚动画时是否动画，默认 true

    - offset: 偏移量

- recordInteraction: 主动通知列表发生了一个事件，以使列表重新计算可视区域。比如说当waitForInteractions为 true 并且用户没有滚动列表时。一般在用户点击了列表项或发生了导航动作时调用

- getNativeScrollRef、getScrollResponder、getScrollableNode: 获取底层滚动的引用、响应器、节点

### Image

> 注：网络和 base64 数据的图片需要手动指定尺寸

默认 Android 上不支持 GIF 和 WebP 格式，[需要手动添加模块](https://www.reactnative.cn/docs/image#%E5%9C%A8-android-%E4%B8%8A%E6%94%AF%E6%8C%81-gif-%E5%92%8C-webp-%E6%A0%BC%E5%BC%8F%E5%9B%BE%E7%89%87)

### 常用 Props

- [style](https://www.reactnative.cn/docs/image#style): 样式，有几个比较不一样的属性可以在文档中过下

- blurRadius: 模糊半径，为图片添加一个指定半径的模糊滤镜

- onLayout: 当元素加载或者布局改变的时候调用，参数为：{nativeEvent: {layout: {x, y, width, height}}}

- onLoad: 加载成功完成时调用此回调函数

- onLoadEnd: 加载结束后，不论成功还是失败，调用此回调函数

- onLoadStart: 加载开始时调用，可以用来做 loading 状态如 onLoadStart={(e) => this.setState({loading: true})}

- onError: 加载错误的回调，参数为{nativeEvent: {error}}

- resizeMode: 相当于 H5 的 background-size

    - cover: 同 H5

    - contain: 同 H5

    - stretch: 拉伸，相当于 H5 100% 100%，会变形

    - repeat: 平铺，如果尺寸超过容器会在保持宽高比的情况下缩放到能被容器包裹

    - center: 居中不拉伸

- source: 图片源数据

- defaultSource: 读取图片时默认显示的图片，{uri: string, width: number, height: number, scale: number}

> 在 Android 的 debug 版本上本属性不会生效（但在 release 版本中会生效）

- loadingIndicatorSource: 类似 source，在图片加载时会先显示它

- testID: 一个唯一的资源标识符，用来在自动测试脚本中标识这个元素

- onProgress: 加载过程中不断调用，参数为{nativeEvent: {loaded, total}}

### 静态方法

- Image.getSize(uri, success, [failure]): 在显示图片前获取图片的宽高，要获取图片的尺寸,首先需要加载或下载图片(同时会被缓存起来)。这意味着理论上你可以用这个方法来预加载图片

    - uri: 图片地址

    - success: 成功的回调

    - failure: 失败的回调

- Image.prefetch(url): 预加载

- Image.abortPrefetch(requestId): 中断预加载，仅 Android 可用

- Image.queryCache(urls): 查询图片缓存状态。根据图片 URL 地址返回缓存状态，比如"disk"（缓存在磁盘文件中）或是"memory"（缓存在内存中）

- Image.resolveAssetSource(source): 将资源解析为具有 uri、width、height 的对象

## ImageBackground

背景图

```tsx
<ImageBackground source={image} style={styles.image}>
    <Text style={styles.text}>Inside</Text>
</ImageBackground>
```

该组件的原理就是个 absolute 定位在 children 旁的 Image，[源码](https://github.com/facebook/react-native/blob/master/Libraries/Image/ImageBackground.js)

### Props

- imageStyle: 传递给 Image 的样式

- imageRef: 挂载中 Image 组件的 ref

- style: 根元素的样式（ImageBackground 的根元素是个 View）

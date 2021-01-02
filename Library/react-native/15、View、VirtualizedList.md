## View

最基本的 UI 组件，支持 Flexbox 布局、样式、触摸响应、和一些无障碍功能的容器。不论在什么平台上，View 都直接对应当前平台的原生视图，无论它是 UIView、div 还是 android.view.View

### 合成点击事件

View 响应属性，如 onResponderMove

- nativeEvent

    - changedTouches: 从上一次事件以来的触摸事件数组

    - identifier: 触摸事件的 ID

    - locationX: 触摸事件相对元素本身位置的 X 坐标

    - locationY: 触摸事件相对元素本身位置的 Y 坐标

    - pageX: 触摸事件相对根元素位置的 X 坐标

    - pageY: 触摸事件相对根元素位置的 Y 坐标

    - target: 接收触摸事件的元素 ID

    - timestamp: 触摸事件的时间标记，用来计算速度

    - touches: 屏幕上所有当前触摸事件的数组.

- Props

- hitSlop: 定义按钮外延范围，即点按钮周围多远也算点到按钮，结构为 { top: number, left: number, bottom: number, right: number }

> 触摸范围不会扩展到父视图之外，另外如果触摸到两个重叠的视图，z-index 高的元素会优先

- pointerEvents: 相当于 H5 的 pointer-events，控制当前视图是否可以作为触控事件的目标

    - auto: 视图可以作为触控事件的目标

    - none: 视图不能作为触控事件的目标

    - box-none: 视图自身不能作为触控事件的目标，但其子视图可以。类似于你在 CSS 中这样设置

```css
.box-none {
     pointer-events: none;
}
.box-none * {
     pointer-events: all;
}
```

    - box-only: 视图自身可以作为触控事件的目标，但其子视图不能。类似于你在 CSS 中这样设置

```css
.box-none {
     pointer-events: all;
}
.box-none * {
     pointer-events: none;
}
```

- removeClippedSubviews: 为 true 时，屏幕外的子视图会被移除，提升性能。要让此属性生效，首先要求视图有很多超出范围的子视图，并且子视图和容器视图（或它的某个祖先视图）都应该有样式 overflow: hidden

- onStartShouldSetResponder(event) => [true | false]: 视图是否要响应 touch start 事件，默认返回 false，event 是上方合成事件

- onMoveShouldSetResponder(event) => [true | false]: 视图是否要响应 touch move 事件，每当有 touch move 事件在这个视图中发生，并且这个视图没有被设置为这个 touch move 的响应时，这个函数就会被调用，默认返回 false，event 是上方合成事件。经过测试得到如下结果：

    - onStartShouldSetResponder true， onMoveShouldSetResponder false，会触发一次 onStartShouldSetResponder，不会触发 onMoveShouldSetResponder，然后正常运行 onResponderGrant 与 onResponderMove

    - onStartShouldSetResponder true， onMoveShouldSetResponder true，效果同上

    - onStartShouldSetResponder false， onMoveShouldSetResponder true，会触发一次 onStartShouldSetResponder，再触发 onMoveShouldSetResponder，然后正常运行 onResponderGrant 与 onResponderMove

    - onStartShouldSetResponder false， onMoveShouldSetResponder false，会触发一次 onStartShouldSetResponder，然后移动时不断触发 onMoveShouldSetResponder，然后不能执行 onResponderGrant 与 onResponderMove

- onStartShouldSetResponderCapture(event) => [true | false]: 相当于 H5 的事件捕获，当父视图和子视图重叠，如果父视图想要阻止子视图响应 touch start 事件，它就应该设置这个方法并返回 true（试了下好像不止是阻止 touch start，touch move 也会阻止掉）

- onMoveShouldSetResponderCapture(event) => [true | false]: 相当于 H5 的事件捕获，当父视图和子视图重叠，如果父视图想要阻止子视图响应 touch move 事件时，它就应该设置这个方法并返回 true

    - 当 onStartShouldSetResponderCapture false, onMoveShouldSetResponderCapture true 时，只能阻止子视图的 move 事件，会触发
    
        - 子视图的 touch start 流程（onStartShouldSetResponder，onResponderGrant 等）
        
        - 然后才触发父视图的 onMoveShouldSetResponderCapture => onResponderGrant => onResponderMove（不会触发父视图的 onStartShouldSetResponder、onMoveShouldSetResponder）

    - 当 onStartShouldSetResponderCapture true，无论 onMoveShouldSetResponderCapture 是什么，都会阻止子视图全部事件，会触发

        - 父视图的 onStartShouldSetResponderCapture => onResponderGrant => onResponderMove（不会触发父视图的 onMoveShouldSetResponderCapture、onStartShouldSetResponder、onMoveShouldSetResponder）

- onResponderGrant(event) => void: 视图开始响应触摸事件

- onResponderMove(event) => void: 用户正在屏幕上移动手指时调用这个函数

- onResponderRelease(event) => void: 触摸操作结束时触发

- onResponderReject(event) => void: 响应者现在“另有其人”而且暂时不会“放权”

- onResponderTerminationRequest(event) => true: 有其他组件请求接替响应者，当前的 View 是否“放权”？返回 true 的话则释放响应者权力（例如父子视图重叠，子视图移动会触发父视图想拿权，如果返回 true，会执行子视图的 onStartShouldSetResponder => onResponderGrant，然后执行父视图的 onMoveShouldSetResponder => onResponderGrant => onResponderMove）

- onResponderTerminate(event) => void: 响应者权力已经交出。这可能是由于其他 View 通过onResponderTerminationRequest请求的，也可能是由操作系统强制夺权（比如 iOS 上的控制中心或是通知中心）

- onLayout: 组件挂载或者布局变化的时候调用，参数为 { nativeEvent: { layout: { x, y, width, height } } }

> 这个事件会在布局计算完成后立即调用一次，不过收到此事件时新的布局可能还没有在屏幕上呈现，尤其是一个布局动画正在进行中的时候

- collapsable(Android): 如果一个 View 只用于布局它的子组件，则它可能会为了优化而从原生布局树中移除。 把此属性设为 false 可以禁用这个优化，以确保对应视图在原生结构中存在

## VirtualizedList

VirtualizedList 是 FlatList 和 SectionList 的底层实现

一般想在使用上有着更高的灵活性，才会使用 VirtualizedList

VirtualizedList 会：

- 优先渲染可视区内的元素

- 将渲染窗口外的全部元素用合适的定长空白替代

- 根据元素距离可视区的远近，优先渲染离可视区近的元素

- 通过这种方式逐步渲染出全部元素

> VirtualizedList 并不是可视区外的 item 在滚到它附近之前不 render 了，只是异步逐步的执行，所以不要以为可视区外的 item 不会 render，只是可能比较慢轮到它，这意味着，假如有 40 个 item，那么初始时可能先 render 10 个，然后一小会又 render 接下去 10 个，逐步把全部 item 都 render 完

```tsx
const DATA: Array<{id: number; name: string}> = [...Array(20).keys()].map(
    index => {
        return {
            id: index,
            name: 'K' + index,
        };
    },
);

const Item: React.FC<{id: number; name: string}> = props => {
    const {id, name} = props;

    return (
        <View style={styles.item}>
            <Text>
                id: {id}; name: {name}
            </Text>
        </View>
    );
};

const getItem = (data: typeof DATA, index: number) => {
    return data[index];
};

const getItemCount = () => 20;

const ITEM_HEIGHT = 50;

const App: React.FC = () => {
    return (
        <View style={styles.container}>
            <View style={styles.list}>
                <VirtualizedList
                    data={DATA} // 必须有这个 data，不然只能渲染 10 条，data 会传给 getItem
                    renderItem={({item}) => {
                        return <Item {...item} />;
                    }}
                    getItemCount={getItemCount} // 告诉组件有多少条
                    getItem={getItem}
                    getItemLayout={(data, index) => ({
                        length: ITEM_HEIGHT,
                        offset: ITEM_HEIGHT * index,
                        index,
                    })}
                    keyExtractor={item => item.id + ''}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        height: 200,
        backgroundColor: 'pink',
    },
    item: {
        height: ITEM_HEIGHT,
        borderBottomWidth: 1,
        borderBottomColor: 'red',
    },
});
```

### Props

- renderItem: 渲染每一行 item，接收 getItem 传过来的 item 数据

- data: 貌似只是传给 getItem 的一个数据源，但是没有的化列表只能渲染 10 条？

- getItem: 从 data 里获取一个 item 数据

- getItemCount: 决定数据块中一共有多少元素

- extraData: 传递给 extraData 的数据改变会让组件刷新，否则在 renderItem，头部、底部等代码里用到其他状态，由于组件 PureComponent 的原因，可能会有不刷新视图的问题

- getItemLayout: 手动告诉 RN 内容的尺寸，不仅可以节省测量内容尺寸的开销，还使得 RN 可以做到某些功能（初始滚到某个位置、滚到渲染区域外的位置等），通常在每一项高度一致的情况下都要使用它

```tsx
getItemLayout={(data, index) => (
    {length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index}
)}
```

> 如果没设置 getItemLayout，其实可以发现列表滚动条是逐步变短的，这是因为组件不知道可视区外的内容有多高，所以一开始列表高可能只有 10 条的高度，然后再异步渲染接下来 10 条后，列表高就有了 20 条的高度，所以滚动条就变短了，以此类推直到全部 item 渲染完成。如果设置了 getItemLayout，就会发现一开始滚动条就已经是完备状态了

- initialScrollIndex: 列表初始时滚到哪个 item 的位置，这个配置要求 getItemLayout 必须实现

- initialNumToRender: 指定一开始渲染的元素数量，最好刚刚够填满一个屏幕，这样保证了用最短的时间给用户呈现可见的内容（性能优化的一种方案，如果指定少了，效果会是立即渲染出指定数量后再闪一下补空）。注意这第一批次渲染的元素不会在滑动过程中被卸载，这样是为了保证用户执行返回顶部的操作时，不需要重新渲染首批元素

- maxToRenderPerBatch: 每批增量渲染可渲染的最大数量。能立即渲染出的元素数量越多，填充速率就越快，但是响应性可能会有一些损失，因为每个被渲染的元素都可能参与或干扰对按钮点击事件或其他事件的响应（前面提到了组件是异步逐次渲染的，每批都有渲染的数量）

- updateCellsBatchingPeriod: 具有较低渲染优先级的元素（比如那些离屏幕相当远的元素）的渲染批次之间的时间间隔（即 maxToRenderPerBatch 是控制每批渲染的数量，updateCellsBatchingPeriod 是控制异步逐次渲染时批次之间时间间隔）

- windowSize: 设置可视区外最大能被渲染的元素的长度，假设可视区域是 100，如果设置 windowSize: 3，那么渲染的就是除了自身可视区域，往上 100 和往下 100 的范围，windowSize 越小可以减少内存消耗提升性能，但是快速滚动也容易出现空白区

- inverted: 是否反转滑动方向。（等价于）使用缩放转化的值为 -1，即初始滚动条在对下面，并且 item 是从下往上排列的

- CellRendererComponent: 每个子项渲染使用的元素。可以是一个 react 组件类，或者一个渲染函数。默认使用 View

```tsx
CellRendererComponent={props => {
    return (
        <View>
            <Text>...</Text>
            {/* children 是 renderItem 的内容 */}
            {props.children}
        </View>
    );
}}
```

- ItemSeparatorComponent: 分割组件，不会出现在列表第一行之前和最后一行之后（具体参考 FlatList 的示例代码）

- listKey: 列表的 key

- ListEmptyComponent: 没有数据时将渲染该组件（getItemCount 返回 0）

- ListFooterComponent: 将渲染在组件底部

- ListFooterComponentStyle: ListFooterComponent 的内部视图的 style

- ListHeaderComponent: 将渲染在组件头部

- ListHeaderComponentStyle: ListHeaderComponent 的内部视图的 style

- renderScrollComponent(props: object) => element: 渲染一个定制的滚动组件。例如不同风格的 RefreshControl

- onRefresh: 会在列表头部添加一个 RefreshControl 控件，实现下拉刷新，即下拉后的回调（先滚到到顶，再下拉，并不是正常滚动滚到负值，一定要在 scrollTop 0 的时候再重新拉一下才算），需要配合 refreshing 属性

- refreshing: 下拉刷新时，等待加载新数据则设为 true，加载后设为 false

```tsx
const App: React.FC = () => {
    const [refreshing, setRefreshing] = useState(false);
    return (
        <View style={styles.container}>
            <View style={styles.list}>
                <VirtualizedList
                    data={DATA}
                    renderItem={({item}) => {
                        return <Item {...item} />;
                    }}
                    getItemCount={getItemCount}
                    getItem={getItem}
                    getItemLayout={(data, index) => ({
                        length: ITEM_HEIGHT,
                        offset: ITEM_HEIGHT * index,
                        index,
                    })}
                    keyExtractor={item => item.id + ''}
                    ListEmptyComponent={() => {
                        return <Text>无数据</Text>;
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

- refreshControl: 自定义下拉刷新，设置后会覆盖默认的 RefreshControl 组件，onRefresh和refreshing属性也将一并忽略。只对纵向布局的VirtualizedList有效

```tsx
const MyRefresh: React.FC<RefreshControlProps> = props => {
    const {refreshing, onRefresh, children} = props;

    // 这里可能会做一些手势操作。。。
    // children 即我们的列表组件
    return (
        <View
            style={{
                flex: 1,
                borderBottomWidth: 5,
                borderBottomColor: 'green',
            }}
        >
            {children}
        </View>
    );
};

const App: React.FC = () => {
    const [refreshing, setRefreshing] = useState(false);
    return (
        <View style={styles.container}>
            <View style={styles.list}>
                <VirtualizedList
                    data={DATA}
                    renderItem={({item}) => {
                        return <Item {...item} />;
                    }}
                    getItemCount={getItemCount}
                    getItem={getItem}
                    getItemLayout={(data, index) => ({
                        length: ITEM_HEIGHT,
                        offset: ITEM_HEIGHT * index,
                        index,
                    })}
                    keyExtractor={item => item.id + ''}
                    ListEmptyComponent={() => {
                        return <Text>无数据</Text>;
                    }}
                    refreshControl={
                        <MyRefresh
                            refreshing={refreshing}
                            onRefresh={() => {
                                setRefreshing(true);
                                console.log(111);

                                setTimeout(() => {
                                    setRefreshing(false);
                                }, 1000);
                            }}
                        />
                    }
                />
            </View>
        </View>
    );
};
```

- horizontal: 是否水平方向

- keyExtractor(item: object, index: number) => string: 指定 Item 的 key，默认取 item.key，没有则取数组下标

- onEndReachedThreshold: 阈值，决定距离底部多远时触发 onEndReached 回调，该参数的值是 0 - 1，如 0.5 是距离底部距离一半

- onEndReached(info: {distanceFromEnd: number}) => void: 滚到离底部 onEndReachedThreshold 时会触发该回调（滚上去又滚下来到阈值也会，不是只触发一次），distanceFromEnd 是触发时离底部的距离，此回调是异步调用的，即滚的越快，触发的会越晚，触发时 distanceFromEnd 的值会越小

- removeClippedSubviews: 为 true 时，父视图外的子视图会被移除，提升大列表的滚动性能，但是被裁剪的子视图依然在内存中，所以它们所占的储存空间没有被释放，内部状态也都保留了下来

> 可能会有 bug

- persistentScrollbar: 让滚动条一直存在（通常滚完一会就消失隐藏了）

- onScrollToIndexFailed: 用来处理滚动到尚未渲染的索引导致滚动失败时的回调。推荐的做法是自己计算偏移量，然后滚动到相应位置，或者滚动到更远的距离当更多的子元素已经渲染后再进行尝试，结构为 (info: { index: number, highestMeasuredFrameIndex: number, averageItemLength: number }) => void

- onViewableItemsChanged: 当列表中行的可见性发生变化时，就会调用这个函数（具体参考 FlatList 章节）

- viewabilityConfig: 可以用来做曝光，元素可见时会触发 onViewableItemsChanged 回调（具体参考 FlatList 章节）

- progressViewOffset(Android): 设置 RefreshControl 下拉加载指示器的位置

### 方法

- scrollToEnd(params: object): 滚到底部，不能在 useEffect 里立即执行，会无效，可能需要延迟

    - animated: 滚动画时是否动画，默认 true

- scrollToIndex(params: object): 滚动到指定 index 项位置，需要设置 getItemLayout 才能滚到渲染外的位置

    - animated: 滚动画时是否动画，默认 true

    - index: 必须，滚到第一项

    - viewOffset: 滚动指定位置后的多少偏移量，如 50 是滚到指定位置上方 50 的位置，需要要滚得更下去，应该是负值 -50

    - viewPosition: 0 - 1，如 index 3 滚到第 4 项，viewPosition 0.5 则滚到起点和第 4 项的中间，viewPosition 为 0 则滚到第 4 项的位置，viewPosition 为 1 还是在起始点

- scrollToItem(params: object): 滚动到指定 item 位置，需要设置 getItemLayout 才能滚到渲染外的位置

    - animated: 滚动画时是否动画，默认 true

    - item: 滚到的项，如 DATA\[4]

    - viewPosition: 同 scrollToIndex

- scrollToOffset(params: object): 滚动列表到指定的偏移，等同于 ScrollView 的 scrollTo 方法

    - animated: 滚动画时是否动画，默认 true

    - offset: 偏移量

- recordInteraction: 主动通知列表发生了一个事件，以使列表重新计算可视区域。比如说当 waitForInteractions 为 true 并且用户没有滚动列表时。一般在用户点击了列表项或发生了导航动作时调用

- flashScrollIndicators: 短暂的显示滚动条

- getNativeScrollRef、getScrollResponder、getScrollableNode: 获取底层滚动的引用、响应器、节点

- setNativeProps(params: object): 手动去操作原生视图

- getChildContext: 略

- hasMore() => boolean: 略
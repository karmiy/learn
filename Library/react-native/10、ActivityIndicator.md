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
                <ScrollView>
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
                </ScrollView>
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
                <ScrollView>
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
                </ScrollView>
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

- keyExtractor(item: object, index: number) => string: 指定 Item 的 key，默认取 item.key，没有则取数组下标
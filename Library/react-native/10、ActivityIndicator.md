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
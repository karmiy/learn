## 安装

```tsx
yarn add react-navigation
yarn add react-navigation-stack
// 需要装下面这些才能运行的了
yarn add react-native-gesture-handler
yarn add react-native-reanimated
yarn add react-native-screens 
yarn add react-native-safe-area-context
yarn add @react-native-community/masked-view
```

```tsx
yarn add react-navigation-tabs
```

## 基本使用

- 新建 A 页面

```tsx
// a.tsx
import React from 'react';
import {View, Text} from 'react-native';

const A: React.FC = () => {
    return (
        <View>
            <Text>这是 A 页面</Text>
        </View>
    );
};

export default A;
```

- 新建 B 页面

```tsx
// b.tsx
import React from 'react';
import {View, Text} from 'react-native';

const B: React.FC = () => {
    return (
        <View>
            <Text>这是 B 页面</Text>
        </View>
    );
};

export default B;
```

```tsx
// app.tsx
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import A from './src/pages/a';
import B from './src/pages/b';

const AppStack = createStackNavigator(
    {
        A: {
            screen: A,
            navigationOptions: {
                headerShown: false,
            },
        },
        B: {
            screen: B,
        },
    },
    {
        mode: 'modal',
        headerMode: 'none',
    },
);

export default createAppContainer(AppStack);
```

## react-navigation-tabs

可以使用 react-navigation-tabs 为页面创建一个底部 tabs，自带子路由

```tsx
yarn add react-navigation-tabs
```

```tsx
// a.tsx
import {createBottomTabNavigator} from 'react-navigation-tabs';
import A1 from './a1'; // 子路由，此处略
import A2 from './a2'; // 子路由，此处略

const BottomNavigator = createBottomTabNavigator({
    A1: {
        screen: A1,
        navigationOptions: {
            title: '首页A1',
            tabBarLabel: '这是首页A1',
        },
    },
    A2: {
        screen: A2,
        navigationOptions: {
            title: '产品页A2',
            tabBarLabel: '这是产品页A2',
        },
    },
});

export default BottomNavigator;
```

## 跳转

```tsx
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {NavigationSwitchScreenProps} from 'react-navigation';

const A1: React.FC<NavigationSwitchScreenProps> = (props) => {
    const {navigation} = props;
    return (
        <View>
            <Text>这是 A 的子页面 1</Text>
            <TouchableOpacity
                onPress={() => navigation.navigate('A2', {id: 10})}>
                <Text>跳转 a2 页面</Text>
            </TouchableOpacity>
        </View>
    );
};

export default A1;
```

## 获取 params

```tsx
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {NavigationSwitchScreenProps} from 'react-navigation';

const A2: React.FC<NavigationSwitchScreenProps<{id: number}>> = (props) => {
    console.log(
        'a2 页面',
        props,
        props.navigation.state.params?.id, // ok
        props.navigation.getParam('id'), // ok
    );
    return (
        <View>
            <Text>这是 A 的子页面 2</Text>
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
                <Text>后退</Text>
            </TouchableOpacity>
        </View>
    );
};

export default A2;
```
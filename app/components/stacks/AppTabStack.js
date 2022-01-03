import React from 'react';
import {Image} from 'react-native'
import { BottomTabBar, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MultiBarProvider, BottomTabBarWrapper} from 'react-native-multibar';
import Icon from 'react-native-vector-icons/FontAwesome5';
import HomeStack from './HomeStack';
import HelpStack from './HelpStack';
import MapStack from './MapStack';
import WeatherStack from './WeatherStack';
import NotificationStack from './NotificationStack';
import OrdersStack from './OrdersStack';
import styles from '../../../assets/css/styles';
import { images, icons, COLORS, FONTS, SIZES } from '../../../constants';

const BottomTab = createBottomTabNavigator();


const AppTabStack = () => {
    return (
        
        <MultiBarProvider
        overlayProps={{
            expandingMode: 'staging'
        }}
        data={[
            ({ params }) => (
                <Icon
                name="chevron-left"
                color="#E24E1B"
                size={12}
                onPress={() => {
                    if (params.canGoBack()) {
                        params.goBack();
                    }
                }}
                />
                ),
                ({ params }) => (
                    <Icon
                    name="flag"
                    color="#E24E1B"
                    size={12}
                    onPress={() => {
                    }}
                    />
                    ),
                    ({ params }) => (
                        <Icon
                        name="headphones"
                        color="#E24E1B"
                        size={12}
                        onPress={() => {
                        }}
                        />
                        ),
                        ({ params }) => (
                            <Icon
                            name="heart"
                            color="#E24E1B"
                            size={12}
                            onPress={() => {
                            }}
                            />
                            ),
                        ]}
                        initialExtrasVisible={false}
                        >
                        <BottomTab.Navigator
                        tabBar={(props) => (
                            <BottomTabBarWrapper params={props.navigation}>
                            <BottomTabBar {...props} />
                            </BottomTabBarWrapper>
                            )}
                            tabBarOptions ={{
                                activeTintColor:styles.colors.orange,
                                inactiveTintColor: styles.colors.black,
                                style: {
                                    backgroundColor: styles.colors.white,
                                },
                                labelStyle:{
                                    fontSize:12,
                                    textAlign:'center',
                                },
                                labelPosition:'below-icon',
                            }}
                            >
                            <BottomTab.Screen
                            name="Home"
                            component={HomeStack}
                            options={{
                                tabBarIcon: ({ color, size }) => (
                                    <Icon
                                    name="home"
                                    style={{
                                        fontSize: 20,
                                        color: color
                                    }}
                                    />
                                    )
                                }}
                                />
                                
                                
                                <BottomTab.Screen
                                name="Orders"
                                component={OrdersStack}
                                options={{
                                    tabBarIcon: ({ color, size }) => (
                                        <Icon
                                            name="list-ul"
                                            style={{
                                                fontSize: 20,
                                                color: color
                                            }}
                                            />
                                        )
                                    }}
                                    />
                                    
                                    <BottomTab.Screen
                                    name="Alerts"
                                    component={NotificationStack}
                                    options={{
                                        tabBarIcon: ({ color, size }) => (
                                            <Icon
                                            name="bell"
                                            style={{
                                                fontSize: 20,
                                                color: color
                                            }}
                                            />
                                            )
                                        }}
                                        />
                                        
                                         <BottomTab.Screen
                                        name="Weather"
                                        component={WeatherStack}
                                        options={{
                                            tabBarIcon: ({ color, size }) => (
                                                <Icon
                                                name="cloud-rain"
                                                style={{
                                                    fontSize: 20,
                                                    color: color
                                                }}
                                                />
                                                )
                                            }}
                                            />
                                            
                                            
                                            <BottomTab.Screen
                                            name="Help"
                                            component={HelpStack}
                                            options={{
                                                tabBarIcon: ({ color, size }) => (
                                                    <Icon
                                                    name="question-circle"
                                                    style={{
                                                        fontSize: 20,
                                                        color: color
                                                    }}
                                                    />
                                                    )
                                                }}
                                                />
                                                
                                                
                                                
                                                </BottomTab.Navigator>
                                                </MultiBarProvider>
                                                );
                                            }
                                            export default AppTabStack
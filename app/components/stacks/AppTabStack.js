import React from 'react';
import {Image} from 'react-native'
import { BottomTabBar, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MultiBarProvider, BottomTabBarWrapper} from 'react-native-multibar';
import Icon from 'react-native-vector-icons/FontAwesome5';
import HomeStack from './HomeStack';
import HelpStack from './HelpStack';
import NotificationStack from './NotificationStack';
import ProfileStack from './ProfileStack';
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
                                activeTintColor:styles.colors.primary,
                                inactiveTintColor: styles.colors.black,
                                style: {
                                    backgroundColor: styles.colors.white,
                                },
                                labelStyle:{
                                    fontSize:13,
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
                                        fontSize: 22,
                                        color: color
                                    }}
                                    />
                                    )
                                }}
                                />
                                
                                
                                <BottomTab.Screen
                                name="Profile"
                                component={ProfileStack}
                                options={{
                                    tabBarIcon: ({ color, size }) => (
                                        <Icon
                                            name="user"
                                            style={{
                                                fontSize: 22,
                                                color: color
                                            }}
                                            />
                                        )
                                    }}
                                    />
                                    
                                    <BottomTab.Screen
                                    name="Notifications"
                                    component={NotificationStack}
                                    options={{
                                        tabBarIcon: ({ color, size }) => (
                                            <Icon
                                            name="bell"
                                            style={{
                                                fontSize: 22,
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
                                                        fontSize: 22,
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
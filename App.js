import React, { Component, useState } from 'react';
import {
    Button, View, Text, TextView, StyleSheet, AsyncStorage,
    TouchableOpacity, ScrollView, Dimensions, Image, FlatList,
    SafeAreaView, RefreshControl, StackActions, NavigationActions,
    TextInput
} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import { Table, Row, Rows } from 'react-native-table-component';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

let devices = [];

class DeviceTile extends React.Component {
    constructor(props) {
        super(props);

        this.name = props.name;
        this.index = props.index;
    }

    render() {
        const styleToAppend = this.index % 2 == 0 ? [styles.tileBg] : [styles.tileBgSecondary];
        return (
            <View style={[styles.tile, styleToAppend]}>
                <Text style={styles.tileText}>{this.name}</Text>
            </View>
        );
    }
}

class Footer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.navigation}>
                <TouchableOpacity
                    style={styles.navigationButton}
                    onPress={() => { this.props.navigation.navigate('Devices'); } }
                >
                    <Text style={styles.navigationButtonText}>Devices</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navigationButton}
                    onPress={() => { this.props.navigation.navigate('Connection'); } }
                >
                    <Text style={styles.navigationButtonText}>Connection</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

class Devices extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            devices: []
        };
        this.getDevices();
    }

    getDevices() {
            AsyncStorage.getItem('List_Of_Devices_2').then((devices) => {
                if((!!devices)) {
                    this.setState({ devices: JSON.parse(devices) });
                }

                console.log('GET', this.state.devices);
            });
    }

    render() {
        return (
            <View style={styles.box}>
                <View style={styles.container}>
                {
                    this.state.devices.map((element, index) => {
                    console.log('EL', element);
                        return <DeviceTile index="1" name={element.name} />
                    })
                }

                    <TouchableOpacity
                        style={styles.tile}
                        onPress={() => {this.props.navigation.navigate('Connection') } }
                    >
                        <Text style={styles.tileText}>+</Text>
                    </TouchableOpacity>

                </View>
                <Footer />
            </View>
        );
    }
}

class ConnectionScreen extends React.Component {
    constructor(props) {
        super(props);

        this.name = '';
        this.place = '';
        this.cmd = '';
        this.color = '';

        this.state = {
            devices: []
        };

        this.getDevices();
    }

    getDevices() {
            AsyncStorage.getItem('List_Of_Devices_2').then((devices) => {
                if((!!devices)) {
                    this.setState({ devices: JSON.parse(devices) });
                }

                 console.log('GET', this.state.devices);
            });
    }

    onChangeTextName(text) {
        this.name = text;
    }

    onChangeTextPlace(text) {
        this.place = text;
    }

    onChangeTextCmd(text) {
        this.cmd = text;
    }

    onChangeTextColor(text) {
        this.color = text;
    }


    saveDevice = (responseData) => {
        const dev = this.state.devices;
        dev[dev.length] = responseData;
        AsyncStorage.setItem('List_Of_Devices_2', JSON.stringify(dev), (err)=> {
            if (err){
                console.log("an asyncstorage error");
                throw err;
            }
            console.log("Saved in POST", JSON.stringify(responseData));
        }).catch((err)=> {
            console.log("error is: " + err);
        }).finally(() => {
            this.props.navigation.navigate('Devices');
        });
    }

    render() {
        return (
            <View style={styles.box}>
                <View style={styles.containerForm}>
                    <TextInput
                        style={{ height: 40, borderColor: 'gray', width: '80%', borderWidth: 1 }}
                        onChangeText={text => this.onChangeTextName(text)}
                    />
                    <TextInput
                        style={{ height: 40, borderColor: 'gray', width: '80%', borderWidth: 1 }}
                        onChangeText={text => this.onChangeTextPlace(text)}
                    />
                    <TextInput
                        style={{ height: 40, borderColor: 'gray', width: '80%', borderWidth: 1 }}
                        onChangeText={text => this.onChangeTextCmd(text)}
                    />
                    <TextInput
                        style={{ height: 40, borderColor: 'gray', width: '80%', borderWidth: 1 }}
                        onChangeText={text => this.onChangeTextColor(text)}
                    />

                </View>
                <View style={styles.connectionBtn}>
                    <TouchableOpacity
                        style={styles.tile}
                        onPress={() => {this.props.navigation.navigate('Devices') } }
                    >
                        <Text style={styles.tileText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.tile}
                        onPress={() => {
                            this.saveDevice({
                                'name': this.name,
                                'place': this.place,
                                'cmd': this.cmd,
                                'color': this.color
                            });
                        } }
                    >
                        <Text style={styles.tileText}>Save</Text>
                    </TouchableOpacity>
                </View>
                <Footer />
            </View>
        );
    }
}

class HomeScreen extends React.Component {
    constructor(props) {
        super(props);

        this.SPLASH_SCREEN_TIME = 2000;
        this.state = {
            isVisible : true,
        }

        this.Splash_Screen = (
            <View style={splashStyles.root}>
                <View style={splashStyles.child}>
                    <Image source={require('./img/loader.png')}
                        style={{width:'100%', height: '100%', resizeMode: 'contain'}}
                    />
                </View>
            </View>
        );

        this.Drawer_Screen = (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Devices navigation={this.props.navigation} />
            </View>
        );
    }

    Hide_Splash_Screen = () => {
        this.setState({
            isVisible : false
        });
    }

    componentDidMount(){
        const that = this;
        setTimeout(() => {
            that.Hide_Splash_Screen();
        }, this.SPLASH_SCREEN_TIME);
    }

    render() {
      return (
        (this.state.isVisible === true) ? this.Splash_Screen :  this.Drawer_Screen
      );
    }
}

export default class App extends Component<Props> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
                <NavigationContainer>
                    <Stack.Navigator>
                        <Stack.Screen name="Devices" component={HomeScreen} />
                        <Stack.Screen name="Connection" component={ConnectionScreen} />
                   </Stack.Navigator>
                </NavigationContainer>
        );
    }
}

const COLOR_WHITE = '#ffffff';
const COLOR_ACCENT = '#ff6961';
const COLOR_SECONDARY = '#ff9994';
const COLOR_BLACK = '#000000';
const COLOR_LINKS = '#45b6fe';

const styles = StyleSheet.create({
    container: {
        width: '100%',
        display: 'flex',
        padding: 20,
        height: '90%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexWrap: 'wrap'
    },

    containerForm: {
        width: '100%',
        display: 'flex',
        padding: 20,
        height: '90%',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },

    box: {
        width: '100%',
        height: '100%'
    },

    tile: {
        width: '45%',
        height: '25%',
        padding: 3,
        fontSize: 100,
        borderColor: '#585858',
        borderWidth: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10
    },

    tileText: {
        fontSize: 30,
        fontFamily: 'langar-regular'
    },

    tileBg: {
        backgroundColor: COLOR_ACCENT
    },

    tileBgSecondary: {
        backgroundColor: COLOR_SECONDARY
    },

    connectionBtn: {
        width: '100%',
        display: 'flex',
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },

    navigation: {
        width: '100%',
        display: 'flex',
        padding: 5,
        height: '10%',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },

    navigationButton: {
        width: '40%',
        height: '10%',
        borderColor: '#585858',
        borderWidth: 1
    },

    navigationButtonText: {
        fontSize: 18,
        textAlign: 'center'
    }
});

const splashStyles = StyleSheet.create({
        root: {
            zIndex: 998,
            justifyContent: 'center',
            flex: 1,
            position: 'absolute',
            width: '100%',
            height: '100%',
        },

        child: {
            zIndex: 999,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: COLOR_ACCENT,
            flex:1,
        },
});
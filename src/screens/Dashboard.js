import React, {Component} from 'react';
import {Text} from "react-native";
import {Notifications} from 'expo';
import * as Permissions from 'expo-permissions';

export default class DashboardScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {token: ''};
    }

    registerForPushNotificationsAsync = async () => {
        const {status: existingStatus} = await Permissions.getAsync(
            Permissions.NOTIFICATIONS
        );
        let finalStatus = existingStatus;

        // only ask if permissions have not already been determined, because
        // iOS won't necessarily prompt the user a second time.
        if (existingStatus !== 'granted') {
            // Android remote notification permissions are granted during the app
            // install, so this will only ask on iOS
            const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }

        // Stop here if the user did not grant permissions
        if (finalStatus !== 'granted') {
            return;
        }

        // Get the token that uniquely identifies this device
        let token = await Notifications.getExpoPushTokenAsync();

        this.setState({token});
        return console.log('token', token); // fixme

        // POST the token to your backend server from where you can retrieve it to send push notifications.
        return fetch(PUSH_ENDPOINT, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: {
                    value: token,
                },
                user: {
                    username: 'Brent',
                },
            }),
        });
    };

    async componentDidMount() {
        await this.registerForPushNotificationsAsync();
    }

    render() {
        return (<Text>Hello Dashboard: {this.state.token}</Text>)
    }
}

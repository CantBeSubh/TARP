import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { auth, db } from '../firebase'
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Calendar } from 'react-native-calendars';
import * as Location from 'expo-location';
import { Marker } from 'react-native-maps';
import MapView from 'react-native-maps';
// new Date(stud.data()["Attendance"][0]["seconds"] * 1000).toDateString()

const Home = () => {
    const [studData, setStudData] = useState({})
    const [parData, setParData] = useState({})
    const [proData, setProData] = useState({})
    const [attendance, setAttendance] = useState([])
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const docSnap = () => {
        getDoc(doc(db, "Students", auth.currentUser.uid))
            .then((stud) => {
                if (stud.exists()) {
                    setStudData(stud.data())
                    console.log("Student data:", stud.data());
                    return stud
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            })
            .then((parent) => {
                getDoc(doc(db, "Parents", parent.data().Parents["_key"]["path"]["segments"][6]))
                    .then((par) => {
                        if (par.exists()) {
                            console.log("Parent data:", par.data());
                            setParData(par.data())
                        } else {
                            // doc.data() will be undefined in this case
                            console.log("No such document!");
                        }
                    })
                    .catch((error) => {
                        console.log("Error getting document:", error);
                    });
                return parent
            })
            .then((proctor) => {
                getDoc(doc(db, "Proctor", proctor.data().Proctor["_key"]["path"]["segments"][6]))
                    .then((pro) => {
                        if (pro.exists()) {
                            console.log("Proctor data:", pro.data());
                            setProData(pro.data())
                        } else {
                            // doc.data() will be undefined in this case
                            console.log("No such document!");
                        }
                    })
                    .catch((error) => {
                        console.log("Error getting document:", error);
                    });
                return proctor
            })
            .catch(error => alert(error.message))
    }

    const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
        }
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
    };
    const navigation = useNavigation()

    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                setStudData({})
                navigation.replace("Login")
            })
            .catch(error => alert(error.message))
    }

    useEffect(() => {
        docSnap()
        getLocation()
    }, [])

    useEffect(() => {
        if (studData && studData.Attendance) {
            setAttendance(studData.Attendance.map((item) => new Date(item["seconds"] * 1000)))
        }
    }, [studData])

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = `Location: ${location.coords.latitude}, ${location.coords.longitude}`;
    }
    return (
        <View style={styles.container}>
            <ScrollView style={{ flex: 1 }}>

                {attendance && attendance.length > 0 &&
                    <Calendar
                        markedDates={
                            attendance.reduce(function (obj, item) {
                                var x = item.getMonth() + 1 < 10 ? "0" : ""
                                x += item.getMonth() + 1
                                var s = item.getFullYear() + "-" + x + "-" + item.getDate()
                                obj[s] = { selected: true, selectedColor: 'red' }
                                console.log(obj)
                                return obj
                            }, {})
                        }
                    />
                }


                <Text>{studData && `${studData.firstName} ${studData.lastName}`}</Text>
                <Text>Email: {auth.currentUser?.email}</Text>
                {attendance && attendance.map((item) => <Text>{item.toDateString()}</Text>)}
                <Text>{parData && `Parent: ${parData.firstName} ${parData.lastName}`}</Text>
                <Text>{proData && `Proctor: ${proData.firstName} ${proData.lastName}`}</Text>
                <Text>{text}</Text>

                <MapView style={styles.map} >
                    {location && <Marker
                        coordinate={location.coords}
                    />
                    }
                </MapView>
                <TouchableOpacity
                    onPress={handleSignOut}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Sign out</Text>
                </TouchableOpacity>
            </ScrollView>

        </View>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#0782F9',
        width: '60%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 40,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    map: {
        width: '100%',
        height: '100%',
    }
})

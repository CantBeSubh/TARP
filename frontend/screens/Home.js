import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { auth, db } from '../firebase'
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";


// new Date(stud.data()["Attendance"][0]["seconds"] * 1000).toDateString()

const Home = () => {
    const [studData, setStudData] = useState({})
    const [parData, setParData] = useState({})

    const docSnap = () => {
        getDoc(doc(db, "Students", auth.currentUser.uid))
            .then((stud) => {
                if (stud.exists()) {
                    setStudData(stud.data())
                    console.log("Document data:", stud.data());
                    return stud.data().Parents["_key"]["path"]["segments"][6]
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            })
            .then((parent) => {
                getDoc(doc(db, "Parents", parent))
                    .then((par) => {
                        if (par.exists()) {
                            console.log("Document data:", par.data());
                            setParData(par.data())
                        } else {
                            // doc.data() will be undefined in this case
                            console.log("No such document!");
                        }
                    })
                    .catch((error) => {
                        console.log("Error getting document:", error);
                    });
            })
            .catch(error => alert(error.message))
    }

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
    }, [])

    return (
        <View style={styles.container}>
            <Text>{studData && `${studData.firstName} ${studData.lastName}`}</Text>
            <Text>Email: {auth.currentUser?.email}</Text>
            <Text>{studData.Attendance && `${new Date(studData.Attendance[0]["seconds"] * 1000).toString()}`}</Text>
            <Text>{parData && `Parent: ${parData.firstName} ${parData.lastName}`}</Text>
            <TouchableOpacity
                onPress={handleSignOut}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Sign out</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
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
})

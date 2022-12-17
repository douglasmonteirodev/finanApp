import React, { useState, useContext } from "react";
import {
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { format } from "date-fns";

import firebase from "../../services/firebaseConnection";

import Picker from "../../components/Picker";
import Header from "../../components/Header";
import { AuthContext } from "../../contexts/auth";

import { Background, Input, SubmitButton, SubmitText } from "./styles";

export default function New() {
  const navigation = useNavigation();

  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("receita");
  const { user: usuario } = useContext(AuthContext);

  function handleSubmit() {
    Keyboard.dismiss();
    if (isNaN(Number(valor)) || tipo === null) {
      alert("Preencha todos os campos");
      return;
    }

    Alert.alert("Confirmando dados", `Tipo ${tipo} - Valor ${Number(valor)}`, [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Continuar",
        onPress: () => handleAdd(),
      },
    ]);
  }

  async function handleAdd() {
    let uid = usuario.uid;
    let key = await firebase.database().ref("historico").child(uid).push().key;

    await firebase
      .database()
      .ref("historico")
      .child(uid)
      .child(key)
      .set({
        tipo,
        valor: Number(valor),
        date: format(new Date(), "dd/MM/yyyy"),
      });

    //Att saldo

    let user = firebase.database().ref("users").child(uid);
    await user.once("value").then((snapshot) => {
      let saldo = Number(snapshot.val().saldo);

      tipo === "despesa" ? (saldo -= Number(valor)) : (saldo += Number(valor));

      user.child("saldo").set(saldo);
    });

    Keyboard.dismiss();
    setValor("");
    navigation.navigate("Home");
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Background>
        <Header />

        <SafeAreaView style={{ alignItems: "center" }}>
          <Input
            placeholder="Valor desejado"
            keyboardType="numeric"
            returnKeyType="next"
            onSubmitEditing={() => Keyboard.dismiss()}
            value={valor}
            onChangeText={(text) => setValor(text)}
          />
          <Picker onChange={setTipo} tipo={tipo} />
          <SubmitButton onPress={handleSubmit}>
            <SubmitText>Registrar</SubmitText>
          </SubmitButton>
        </SafeAreaView>
      </Background>
    </TouchableWithoutFeedback>
  );
}

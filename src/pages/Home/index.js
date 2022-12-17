import React, { useContext, useEffect, useState } from "react";
import firebase from "../../services/firebaseConnection";
import { format, isBefore } from "date-fns";
import { Alert, Platform, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import { AuthContext } from "../../contexts/auth";
import Header from "../../components/Header";
import HistoricoList from "../../components/HistoricoList";
import DatePicker from "../../components/DatePicker";

import {
  Background,
  Container,
  Nome,
  Saldo,
  Title,
  List,
  Area,
} from "./styles";

export default function Home() {
  const { user } = useContext(AuthContext);

  const [historico, setHistorico] = useState([]);
  const [saldo, setSaldo] = useState(0);

  const [newDate, setNewDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const uid = user && user.uid;

  useEffect(() => {
    async function loadList() {
      await firebase
        .database()
        .ref("users")
        .child(uid)
        .on("value", (snapshot) => {
          setSaldo(snapshot.val().saldo);
        });

      await firebase
        .database()
        .ref("historico")
        .child(uid)
        .orderByChild("date")
        .equalTo(format(newDate, "dd/MM/yyyy"))
        .limitToLast(10)
        .on("value", (snapshot) => {
          setHistorico([]);

          snapshot.forEach((childItem) => {
            let list = {
              key: childItem.key,
              tipo: childItem.val().tipo,
              valor: childItem.val().valor,
              date: childItem.val().date,
            };

            setHistorico((oldArray) => [...oldArray, list].reverse());
          });
        });
    }

    loadList();
  }, [newDate]);

  function handleDelete(data) {
    //Pegar data do item

    const [diaItem, mesItem, anoItem] = data.date.split("/");
    const dateItem = new Date(`${anoItem}/${mesItem}/${diaItem}`);

    //Pegar data de hoje

    const formatDiaHoje = format(new Date(), "dd/MM/yyyy");
    const [diaHoje, mesHoje, anoHoje] = formatDiaHoje.split("/");
    const dateHoje = new Date(`${anoHoje}/${mesHoje}/${diaHoje}`);

    if (isBefore(dateItem, dateHoje)) {
      //Se a data do registro ja passou
      alert("Você não pode excluir um registro antigo");
      return;
    }

    Alert.alert(
      "Cuidado Atenção!",
      `
    Você deseja excluir ${data.tipo} - Valor: ${data.valor}`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Continuar",
          onPress: () => handleDeleteSucess(data),
        },
      ]
    );
  }

  async function handleDeleteSucess(data) {
    await firebase
      .database()
      .ref("historico")
      .child(uid)
      .child(data.key)
      .remove()
      .then(async () => {
        let saldoAtual = saldo;
        data.tipo === "despesa"
          ? (saldoAtual += Number(data.valor))
          : (saldoAtual -= Number(data.valor));

        await firebase
          .database()
          .ref("users")
          .child(uid)
          .child("saldo")
          .set(saldoAtual);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleShowPicker() {
    setShow(true);
  }

  function onChange(date) {
    setShow(Platform.OS === "ios");
    setShow(false);
    setNewDate(date);
    console.log(date);
  }

  return (
    <Background>
      <Header />

      <Container>
        <Nome>Olá, {user && user.nome}</Nome>
        <Saldo>
          R$ {saldo.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}
        </Saldo>
      </Container>

      <Area>
        <TouchableOpacity onPress={handleShowPicker}>
          <Icon name="event" size={30} color="#fff" />
        </TouchableOpacity>
        <Title>Movimentações do dia</Title>
      </Area>

      <List
        showsVerticalScrollIndicator={false}
        data={historico}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <HistoricoList data={item} deleteItem={handleDelete} />
        )}
      />

      {show && <DatePicker date={newDate} onChange={onChange} />}
    </Background>
  );
}

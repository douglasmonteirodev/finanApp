import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";

const AuthStack = createStackNavigator();

export default function AuthRoutes() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="Signin"
        component={Signin}
        options={{
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name="Signup"
        component={Signup}
        options={{
          headerStyle: {
            backgroundColor: "#131313",
            borderBottomWidth: 1,
            borderBottomColor: "#00b94a",
          },
          headerTintColor: "#fff",
          headerBackTitleVisible: false,
          headerTitle: "Voltar",
        }}
      />
    </AuthStack.Navigator>
  );
}

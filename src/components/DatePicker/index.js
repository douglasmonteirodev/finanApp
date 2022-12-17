import React, { useState } from "react";
import { Container } from "./styles";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function DatePicker({ date, onChange }) {
  const [dateNow, setDateNow] = useState(new Date(date));

  return (
    <Container>
      <DateTimePicker
        value={dateNow}
        mode="date"
        display="default"
        onChange={(e, d) => {
          const currentDate = d || dateNow;

          setDateNow(currentDate);
          onChange(currentDate);
        }}
        style={{ backgroundColor: "white" }}
      />
    </Container>
  );
}

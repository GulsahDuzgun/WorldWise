import { useNavigate } from "react-router-dom";
import Button from "./Button";

function ButtonBack() {
  const navigation = useNavigate();
  return (
    <Button
      type="back"
      handleClick={(e) => {
        e.preventDefault();
        navigation(-1);
      }}
    >
      &larr; Back
    </Button>
  );
}

export default ButtonBack;

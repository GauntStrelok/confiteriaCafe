import React, {useState, useEffect} from 'react';
import './App.css';
import Button from 'react-bootstrap/Button';
import CONST from './constants';

const prices = CONST.prices;
function App() {

  const initialExtras = {
    leche: 0,
    cacao: 0,
    chocolate: 0,
    ron: 0
  };

  const [extras, setExtras] = useState(initialExtras);

  const [cafeDescription, setCafeDescription] = useState("");

  const [finalPrice, setFinalPrice] = useState(10);

  const [cafeBase, setCafeBase] = useState();

  const [payTime, setPayTime] = useState(false);

  const [idAccepted, setIDAccepted] = useState(false);

  const [saldo, setSaldo] = useState(0);

  const [errorMessage, setErrorMessage] = useState("");

  const [idUsuario, setIdUsuario] = useState("");
  const handleChangeIdUsuario = (evt) => {
    setIdUsuario(evt.target.value);
  }

  useEffect(() => {
    let finalPrice = prices[cafeBase]; //precio base cafe simple
    finalPrice += extras.leche * prices.leche;
    finalPrice += extras.cacao * prices.cacao;
    finalPrice += extras.chocolate * prices.chocolate;
    finalPrice += extras.ron * prices.ron;
    setFinalPrice(finalPrice);

    let newCafeDescription = `Cafe ${cafeBase}`;

    if (extras.leche) {
      newCafeDescription += ` con leche${extras.leche > 1
        ? `(${extras.leche})`
        : ''}`;
    }
    if (extras.cacao) {
      newCafeDescription += ` con cacao${extras.cacao > 1
        ? `(${extras.cacao})`
        : ''}`;
    }
    if (extras.chocolate) {
      newCafeDescription += ` con chocolate${extras.chocolate > 1
        ? `(${extras.chocolate})`
        : ''}`;
    }
    if (extras.ron) {
      newCafeDescription += ` con ron${extras.ron > 1
        ? `(${extras.ron})`
        : ''}`;
    }

    setCafeDescription(newCafeDescription);
  }, [extras, cafeBase]);

  useEffect(() => {
    if (idAccepted) {
      console.log(2343543);
      (async () => {
        var url = new URL("http://localhost:3001/balance");
        url.searchParams.append("id", idAccepted);
        const response = await fetch(url, {method: "GET"});
        let saldoString = await response.text();
        setSaldo(parseInt(saldoString));
      })()
    }
  }, [idAccepted])

  const agregarComponente = (extra) => {
    return(evt) => {
      let newExtras = {
        ...extras
      };
      newExtras[extra]++;
      setExtras(newExtras);
    }
  }

  const elegirCafe = (cafe) => {
    return() => {
      setCafeBase(cafe);
    }
  }

  const borrarExtras = () => {
    setExtras(initialExtras);
  }

  const borrarCafe = () => {
    setExtras(initialExtras);
    setCafeBase();
  }

  const showPayment = () => {
    setPayTime(true)
  }

  const aceptarID = () => {
    setIDAccepted(idUsuario);
  }

  const deleteID = () => {
    setIdUsuario("");
  }

  const cancelPayment = () => {
    setPayTime(false);
    borrarCafe();
  }

  const keypadNumberClick = (number) => {
    return() => {
      setIdUsuario(idUsuario + number);
    }
  }

  const pay = async () => {
    if (saldo < finalPrice) {
      setErrorMessage("No tiene suficiente dinero, trate con otro ID de usuario");
    } else {
      const response = await fetch("http://localhost:3001/pay", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({id: idAccepted, money: finalPrice})
      });
      if(response.status === 200) {
        cancelPayment();
        deleteID();
        setIDAccepted("");
        setSaldo(0);
      } else {
        setErrorMessage("No tiene suficiente dinero, intente con otro ID de usuario");
      }
    }
  }

  const payment = () => {
    return <div>
      <div className="col-md-6 col-lg-6">
        <div className="descriptionText">
          <span>Ingrese numero de usuario</span>
          <input value={idUsuario} onChange={handleChangeIdUsuario} className="w-100"></input>
          <table className="touchNumberInput" id="keypad">
            <tbody>
              <tr>
                <td onClick={keypadNumberClick(1)}>1</td>
                <td onClick={keypadNumberClick(2)}>2</td>
                <td onClick={keypadNumberClick(3)}>3</td>
              </tr>
              <tr>
                <td onClick={keypadNumberClick(4)}>4</td>
                <td onClick={keypadNumberClick(5)}>5</td>
                <td onClick={keypadNumberClick(6)}>6</td>
              </tr>
              <tr>
                <td onClick={keypadNumberClick(7)}>7</td>
                <td onClick={keypadNumberClick(8)}>8</td>
                <td onClick={keypadNumberClick(9)}>9</td>
              </tr>
              <tr>
                <td onClick={keypadNumberClick(0)} colSpan="2">0</td>
                <td onClick={deleteID}>Borrar</td>
              </tr>
            </tbody>
          </table>
          <Button variant="success" block="block" onClick={aceptarID}>Aceptar</Button>
          <Button variant="danger" block="block" onClick={cancelPayment}>Cancelar</Button>
        </div>
      </div>
      {
        idAccepted
          ? <div className="col-md-6 col-lg-6 descriptionText">
              <span>Saldo: ${saldo}</span>
              <Button variant="success" block="block" onClick={pay}>Pagar</Button>
              <span className="errorMessage">{errorMessage}</span>
            </div>
          : <div className="col-md-6 col-lg-6"></div>
      }

    </div>
  }

  const seleccionCafe = () => {
    return <div>{
        cafeBase
          ? <div className="col-md-6 col-lg-6">
              <Button variant="primary" size="lg" block="block" onClick={agregarComponente("leche")}>
                Agregar leche
              </Button>

              <Button variant="primary" size="lg" block="block" onClick={agregarComponente("cacao")}>
                Agregar cacao
              </Button>

              <Button variant="primary" size="lg" block="block" onClick={agregarComponente("chocolate")}>
                Agregar chocolate
              </Button>

              <Button variant="primary" size="lg" block="block" onClick={agregarComponente("ron")}>
                Agregar ron
              </Button>

              <Button variant="danger" size="lg" block="block" onClick={borrarExtras}>Borrar extras</Button>

              <Button variant="danger" size="lg" block="block" onClick={borrarCafe}>Borrar todo</Button>
            </div>
          : <div className="col-md-6 col-lg-6">
              <Button variant="primary" size="lg" block="block" onClick={elegirCafe("chico")}>
                Cafe chico
              </Button>

              <Button variant="primary" size="lg" block="block" onClick={elegirCafe("mediano")}>
                Cafe mediano
              </Button>

              <Button variant="primary" size="lg" block="block" onClick={elegirCafe("grande")}>
                Cafe grande
              </Button>

              <Button variant="primary" size="lg" block="block" onClick={elegirCafe("veinte")}>
                Veinte
              </Button>
            </div>
      }
      {
        cafeBase
          ? <div className="col-md-6 col-lg-6 descriptionText">
              <div>{cafeDescription}</div>
              <div>${finalPrice}</div>
              <Button variant="success" size="lg" block="block" onClick={showPayment} className="absolute btm0">
                Aceptar
              </Button>
            </div>
          : <div></div>
      }</div>
  }

  return <div className="cafeteria">
    {
      payTime
        ? payment()
        : seleccionCafe()
    }
  </div>;
}

export default App;
/*
<div className="App">
  <span>un texto en un span</span>
</div>
<div className="App">
  <span>un texto en un span</span>
</div>
<div className="App">
  <span>un texto en un span</span>
</div>
*/

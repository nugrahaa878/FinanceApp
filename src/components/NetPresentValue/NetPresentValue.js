import "./style.css";
import React, { useState, useReducer } from "react";
import { Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import Profit from "../Profit/Profit";
import Loss from "../Loss/Loss";

function InternalRateReturn() {
  // register berfungsi untuk mendaftarkan form ke hook
  const { register, handleSubmit } = useForm();

  const [npv, setNvp] = useState(0);
  const [profit, setProfit] = useState(null);

  const [{isLoading, loadingText}, dispatch] = useReducer(reducer, {
    isLoading: false,
    loadingText: "Your Calculating is "
  });

  function reducer(state, action) {
    switch (action.type) {
      case "loading":
        return {
          isLoading: !state.isLoading,
          loadingText: state.loadingText + "Loading"
        };
      case "notloading":
        return {
          isLoading: !state.isLoading,
          loadingText: "Finish, Please Scroll Down"
        };
      default :
        return state;
    }
  }

  function fetchInternalRateReturn(opts) {
    fetch(
      "https://joq5a3kgek.execute-api.us-east-1.amazonaws.com/production/my-haskell-lambda",
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "x-api-key": "obxQYk7GGVaDb68YgrtUh1YJAskJinwj9WTYmxUI",
        },
        body: JSON.stringify({ body: JSON.stringify(opts) }),
      }
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data["body"] === null) {
          handleSetProfit("Please Fill in All Forms");
        } else {
          countProfit(opts["project_cost"], data["body"]);
          handleSetNvp(data["body"]);
        }
      });
  }

  function handleSetNvp(data) {
    setNvp(data);
  }

  function handleSetProfit(data) {
    setProfit(data);
  }

  function countProfit(cost, npv) {
    dispatch({ type: "notloading", loadingText: "Finish . . ."})
    if (npv - cost > 0) {
      setProfit(<Profit />);
    } else {
      setProfit(<Loss />);
    }
  }

  const onSubmit = async (data) => {
    console.log(data);
    dispatch({ type: "loading", loadingText: "Loading . . ."})
    data["income_1"] = parseFloat(data["income_1"]);
    data["income_2"] = parseFloat(data["income_2"]);
    data["income_3"] = parseFloat(data["income_3"]);
    data["income_4"] = parseFloat(data["income_4"]);
    data["income_5"] = parseFloat(data["income_5"]);
    data["outcome_1"] = parseFloat(data["outcome_1"]);
    data["outcome_2"] = parseFloat(data["outcome_2"]);
    data["outcome_3"] = parseFloat(data["outcome_3"]);
    data["outcome_4"] = parseFloat(data["outcome_4"]);
    data["outcome_5"] = parseFloat(data["outcome_5"]);
    data["project_interest"] = parseFloat(data["project_interest"]);
    data["project_cost"] = parseFloat(data["project_cost"]);

    console.log(JSON.stringify({ body: JSON.stringify(data) }));
    fetchInternalRateReturn(data);
  };

  return (
    <div>
      <h1> Is your Business Good or Not? </h1>
      <p className="calculate">Calculate With Net Present Value (NPV)</p>
      <form>
        <h2>INCOME</h2>
        <Row className="justify-content-center">
          <div className="form-container">
            <label> Income year 1 </label>
            <br></br>
            <input type="number" name="income_1" ref={register()} />
          </div>
          <div className="form-container">
            <label> Income year 2 </label>
            <br></br>
            <input type="number" name="income_2" ref={register()} />
          </div>
          <div className="form-container">
            <label> Income year 3 </label>
            <br></br>
            <input type="number" name="income_3" ref={register()} />
          </div>
          <div className="form-container">
            <label> Income year 4 </label>
            <br></br>
            <input type="number" name="income_4" ref={register()} />
          </div>
          <div className="form-container">
            <label> Income year 5 </label>
            <br></br>
            <input type="number" name="income_5" ref={register()} />
          </div>
        </Row>
        <h2>OUTCOME</h2>
        <Row className="justify-content-center">
          <div className="form-container">
            <label> Outcome year 1</label>
            <br></br>
            <input type="number" name="outcome_1" ref={register()} />
          </div>
          <div className="form-container">
            <label> Outcome year 2</label>
            <br></br>
            <input type="number" name="outcome_2" ref={register()} />
          </div>
          <div className="form-container">
            <label> Outcome year 3</label>
            <br></br>
            <input type="number" name="outcome_3" ref={register()} />
          </div>
          <div className="form-container">
            <label> Outcome year 4</label>
            <br></br>
            <input type="number" name="outcome_4" ref={register()} />
          </div>
          <div className="form-container">
            <label> Outcome year 5</label>
            <br></br>
            <input type="number" name="outcome_5" ref={register()} />
          </div>
        </Row>
        <h2>INTEREST AND COST</h2>
        <Row className="justify-content-center">
          <div className="form-container">
            <label> Project Interest</label>
            <br></br>
            <input type="number" name="project_interest" ref={register()} />
          </div>
          <div className="form-container">
            <label> Project Cost</label>
            <br></br>
            <input type="number" name="project_cost" ref={register()} />
          </div>
        </Row>

        <Row className="justify-content-center">
          <button
            className="submit-button"
            type="button"
            onClick={handleSubmit(onSubmit)}
          >
            Check my Business
          </button>
        </Row>

        <h1 className="result">Your NPV : {npv}</h1>
        <h1>{loadingText}</h1>
        <h1 className="result">Good or Not? <br></br><br></br>{profit}</h1>
      </form>
    </div>
  );
}

export default InternalRateReturn;

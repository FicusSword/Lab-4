import React, { useState } from 'react';
import './Calculator.css';

const Calculator: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [display, setDisplay] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [firstNumber, setFirstNumber] = useState<number | null>(null);

  const handleInput = (value: string) => {
    setInput((prev) => prev + value);
    setDisplay((prev) => prev + value);
  };

  const clearInput = () => {
    setInput('');
    setDisplay('');
    setResult(null);
    setOperator(null);
    setFirstNumber(null);
  };

  const handleOperator = (op: string) => {
    if (input) {
      setFirstNumber(parseFloat(input));
      setOperator(op);
      setDisplay((prev) => prev + ` ${op} `);
      setInput('');
    }
  };

  const calculateResult = () => {
    if (firstNumber !== null && operator && input) {
      const secondNumber = parseFloat(input);
      let resultValue: number | null = null;

      switch (operator) {
        case '+':
          resultValue = firstNumber + secondNumber;
          break;
        case '-':
          resultValue = firstNumber - secondNumber;
          break;
        case '*':
          resultValue = firstNumber * secondNumber;
          break;
        case '/':
          resultValue = firstNumber / secondNumber;
          break;
        default:
          break;
      }

      if (resultValue !== null) {
        setResult(resultValue);
        setDisplay(resultValue.toString());
        setInput(resultValue.toString());
        setFirstNumber(null);
        setOperator(null);
      }
    }
  };

  const sqrt = () => {
    const number = parseFloat(input);
    if (!isNaN(number) && number >= 0) {
      const resultValue = Math.sqrt(number);
      setResult(resultValue);
      setDisplay(`√(${number}) = ${resultValue}`);
      setInput(resultValue.toString());
    }
  };

  const power = (exponent: number) => {
    const number = parseFloat(input);
    if (!isNaN(number)) {
      const resultValue = Math.pow(number, exponent);
      setResult(resultValue);
      setDisplay(`${number}^${exponent} = ${resultValue}`);
      setInput(resultValue.toString());
    }
  };

  return (
    <div className="calculator">
      <h2>Калькулятор</h2>
      <div className="display">
        <div className="history">{display}</div>
        <input type="text" value={input} readOnly />
        <div className="result">{result !== null ? `Результат: ${result}` : ''}</div>
      </div>
      <div className="buttons">
        <button onClick={() => handleInput('7')}>7</button>
        <button onClick={() => handleInput('8')}>8</button>
        <button onClick={() => handleInput('9')}>9</button>
        <button onClick={() => handleOperator('+')}>+</button>

        <button onClick={() => handleInput('4')}>4</button>
        <button onClick={() => handleInput('5')}>5</button>
        <button onClick={() => handleInput('6')}>6</button>
        <button onClick={() => handleOperator('-')}>-</button>

        <button onClick={() => handleInput('1')}>1</button>
        <button onClick={() => handleInput('2')}>2</button>
        <button onClick={() => handleInput('3')}>3</button>
        <button onClick={() => handleOperator('*')}>*</button>

        <button onClick={() => handleInput('0')}>0</button>
        <button onClick={() => handleInput('.')}>.</button>
        <button onClick={clearInput}>C</button>
        <button onClick={() => handleOperator('/')}>/</button>

        <button onClick={() => power(2)}>x²</button>
        <button onClick={sqrt}>√</button>
        <button onClick={calculateResult}>=</button>
      </div>
    </div>
  );
};

export default Calculator;
// dekh=let
// kaho=console.log
// yadi=if
// varna=else
// chayan=switch
// case=case
// default=default
// ruko=break
// chalteRaho=continue
// jabTak=while
// chakr=for
// karya=function
// :) = single line comment
// tasty=true
// bekar=false
// khatam=null
// lautJao = return
// ()^_^{} = ()=>{}
// ~~~ = ...

function token(code) {
  let tokens = [];
  for (let i = 0; i < code.length; i++) {
    if (code.charAt(i) === " ") {
      tokens.push({ type: "space", value: " " });
    } else if (/^[a-zA-Z]$/.test(code.charAt(i))) {
      let word = code.charAt(i);
      i++;
      while (/^[a-zA-Z0-9]$/.test(code.charAt(i))) {
        word += code.charAt(i);
        i++;
      }
      i--;
      if (
        word == "kaho" ||
        word == "dekh" ||
        word == "yadi" ||
        word == "varna" ||
        word == "chayan" ||
        word == "ruko" ||
        word == "chalteRaho" ||
        word == "jabTak" ||
        word == "karya" ||
        word == "tasty" ||
        word == "bekar" ||
        word == "khatam" ||
        word == "chakr" ||
        word == "lautJao"
      ) {
        tokens.push({ type: "keyword", value: word });
      } else {
        tokens.push({ type: "identifier", value: word });
      }
    } else if (/^['"]$/.test(code.charAt(i))) {
      let quoteType = code.charAt(i);
      let word = quoteType;
      i++;

      while (code.charAt(i) !== quoteType) {
        word += code.charAt(i);
        i++;
      }

      word += quoteType;

      tokens.push({ type: "literal", value: word });
    } else if (/^[0-9]$/.test(code.charAt(i))) {
      let word = code.charAt(i);
      i++;
      while (/^[0-9]$/.test(code.charAt(i))) {
        word += code.charAt(i);
        i++;
      }
      i--;
      tokens.push({ type: "number", value: word });
    } else if (code.charAt(i) === "\n") {
      tokens.push({ type: "newline", value: "\n" });
    } else if (code.slice(i, i + 2) === ":)") {
      tokens.push({ type: "comment", value: "//" });
      i++;
    } else if (code.slice(i, i + 3) === "^_^") {
      tokens.push({ type: "arrow", value: "=>" });
      i += 2;
    } else if (code.slice(i, i + 3) === "~~~") {
      tokens.push({ type: "Spread", value: "..." });
      i += 2;
    } else if (/^[~!@#$%^&*()_+`\-=[\]{};:<>,./?]$/.test(code.charAt(i))) {
      tokens.push({ type: "symbol", value: code.charAt(i) });
    }
  }
  return tokens;
}
function gen(tokens) {
  const js = tokens.map((ele) => {
    if (ele.type == "keyword") {
      if (ele.value == "dekh") {
        ele.value = "let";
      } else if (ele.value == "kaho") {
        ele.value =
          "document.querySelector('#run').innerHTML+='<br/>> ';document.querySelector('#run').innerHTML+=";
      } else if (ele.value == "yadi") {
        ele.value = "if";
      } else if (ele.value == "varna") {
        ele.value = "else";
      } else if (ele.value == "chakr") {
        ele.value = "for";
      } else if (ele.value == "chayan") {
        ele.value = "switch";
      } else if (ele.value == "ruko") {
        ele.value = "break";
      } else if (ele.value == "chalteRaho") {
        ele.value = "continue";
      } else if (ele.value == "jabTak") {
        ele.value = "while";
      } else if (ele.value == "karya") {
        ele.value = "function";
      } else if (ele.value == "tasty") {
        ele.value = "true";
      } else if (ele.value == "bekar") {
        ele.value = "false";
      } else if (ele.value == "khatam") {
        ele.value = "null";
      } else if (ele.value == "lautJao") {
        ele.value = "return";
      }
    }

    return ele;
  });

  return js
    .map((ele) => {
      let val = ele.value;
      return val;
    })
    .join("");
}

export default function compile(code) {
  const tokens = token(code);
  const jeetCode = gen(tokens);
  
  try {
     eval(jeetCode);
    return 1;
  } catch (err) {
    
    return err.message;
  }

  
}

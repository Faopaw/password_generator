import "./style.css";

export default function csprngp(length: number): string[] {
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  const stringArray = uint8ArrayToStringArray(randomValues);
  return stringArray;
}

function uint8ArrayToStringArray(uint8Array: Uint8Array): string[] {
  return Array.from(uint8Array, (byte) => String.fromCharCode(byte));
}

function generate_password(): undefined {
  // fill the dictionary depending on what boxes are checked

  let cbidlower = document.getElementById("cbidlower") as HTMLInputElement;
  let cbidupper = document.getElementById("cbidupper") as HTMLInputElement;
  let cbidnumber = document.getElementById("cbidnumber") as HTMLInputElement;
  let cbidspecials = document.getElementById(
    "cbidspecials"
  ) as HTMLInputElement;

  let dictionary = "";

  if (cbidlower.checked) {
    dictionary += "qwertyuiopasdfghjklzxcvbnm";
  }
  if (cbidupper.checked) {
    dictionary += "QWERTYUIOPASDFGHJKLZXCVBNM";
  }
  if (cbidnumber.checked) {
    dictionary += "1234567890";
  }
  if (cbidspecials.checked) {
    dictionary += "!@#$%^&*()_+-={}[];<>:";
    // 84
  }

  const length = (
    document.querySelector('input[type="range"]') as HTMLInputElement
  ).valueAsNumber;

  if (length < 1 || dictionary.length === 0) {
    (document.querySelector('input[type="text"]')! as HTMLInputElement).value =
      "";
    return undefined;
  }

  // TODO: Fix the problem of TOFU text 03/06/24
  // let password = (csprngp(length)).join("");
  function getRandomNumbers(
    length: number,
    dictionaryLength: number
  ): number[] {
    // Create a Uint8Array of the specified length
    const randomValues = new Uint8Array(length);

    // Fill the array with cryptographically secure random values
    crypto.getRandomValues(randomValues);

    // Map the random values to the range 0 to the length of the dictionary
    const maxRandomValue = 255;
    const range = dictionaryLength; //e.g   0 to 84 is 85 possible values
    return Array.from(randomValues, (value) =>
      Math.floor((value / maxRandomValue) * range)
    );
  }

  let passwordarray = getRandomNumbers(length, dictionary.length);
  let password = "";

  for (let i = 0; i < passwordarray.length; i++) {
    const pos = Math.floor(Math.random() * dictionary.length);
    password += dictionary[pos];
  }

  (document.querySelector('input[type="text"]')! as HTMLInputElement).value =
    password;

  return undefined;
}

//add event listeners to the checkboxes and the generate button
[
  ...document.querySelectorAll('input[type="checkbox"], button.generate'),
].forEach((elem) => {
  elem.addEventListener("click", generate_password);
});
// call the generate function if the range is changed
document
  .querySelector("input[type='range']")!
  .addEventListener("input", (e) => {
    document.querySelector("div.range span")!.innerHTML = (
      e.target! as HTMLInputElement
    ).value;
    generate_password();
  });

// copy the password onto the system clipboard so that it can be pasted elsewhere
document.querySelector("div.password button")!.addEventListener("click", () => {
  const password = (
    document.querySelector("input[type='text']")! as HTMLInputElement
  ).value;
  navigator.clipboard.writeText(password).then(() => {
    document.querySelector("div.password button")!.innerHTML = "Copied!";
    setTimeout(() => {
      document.querySelector("div.password button")!.innerHTML = "Copy";
    }, 1000);
  });
});

generate_password();

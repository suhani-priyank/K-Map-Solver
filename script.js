const cells = document.querySelectorAll(".cell");
let minterms = [];

/* ---------- Generate K-Map ---------- */
function generate() {
  minterms = [];
  cells.forEach(c => c.classList.remove("active"));

  let input = document.getElementById("minterms").value.trim();
  if (!input) {
    alert("Enter minterms");
    return;
  }

  input.split(",").forEach(n => {
    let m = Number(n.trim());
    if (m >= 0 && m <= 15 && !minterms.includes(m)) {
      minterms.push(m);
      cells.forEach(c => {
        if (Number(c.dataset.i) === m)
          c.classList.add("active");
      });
    }
  });

  document.getElementById("sop").innerText =
    `Given SOP: F(A,B,C,D) = Σ(${minterms.join(", ")})`;

  document.getElementById("groups").innerText = "";
  document.getElementById("result").innerText = "";
}

/* ---------- Solve K-Map ---------- */
function solve() {
  if (minterms.length === 0) {
    document.getElementById("result").innerText = "Result = 0";
    return;
  }

  let implicants = quineMcCluskey(minterms);

  let finalExpr = implicants.map(toExpression).join(" + ");

  document.getElementById("result").innerText =
    "Final K-Map Answer: F = " + finalExpr;
}

/* ---------- Reset ---------- */
function resetAll() {
  minterms = [];
  document.getElementById("minterms").value = "";
  document.getElementById("sop").innerText = "";
  document.getElementById("groups").innerText = "";
  document.getElementById("result").innerText = "";
  cells.forEach(c => c.classList.remove("active"));
}

/* ---------- Quine–McCluskey ---------- */
function toBinary(n) {
  return n.toString(2).padStart(4, "0");
}

function combine(a, b) {
  let diff = 0, res = "";
  for (let i = 0; i < 4; i++) {
    if (a[i] !== b[i]) {
      diff++;
      res += "-";
    } else res += a[i];
  }
  return diff === 1 ? res : null;
}

function quineMcCluskey(mins) {
  let groups = {};
  mins.forEach(m => {
    let bin = toBinary(m);
    let ones = bin.split("1").length - 1;
    groups[ones] = groups[ones] || [];
    groups[ones].push(bin);
  });

  let primes = new Set(), used = new Set();
  let keys = Object.keys(groups).map(Number).sort();

  for (let i = 0; i < keys.length - 1; i++) {
    groups[keys[i]].forEach(a => {
      groups[keys[i + 1]].forEach(b => {
        let c = combine(a, b);
        if (c) {
          used.add(a); used.add(b);
          primes.add(c);
        }
      });
    });
  }

  Object.values(groups).flat().forEach(b => {
    if (!used.has(b)) primes.add(b);
  });

  return [...primes];
}

function toExpression(term) {
  const v = ["A", "B", "C", "D"];
  let exp = "";
  for (let i = 0; i < 4; i++) {
    if (term[i] === "1") exp += v[i];
    if (term[i] === "0") exp += v[i] + "'";
  }
  return exp || "1";
}

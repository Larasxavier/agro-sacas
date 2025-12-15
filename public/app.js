async function load() {
  const r = await fetch("/resumo");
  const data = await r.json();
  document.getElementById("out").textContent =
    JSON.stringify(data, null, 2);
}
load();

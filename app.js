const cats=[
  ["🛒","Азық-түлік"],["🎮","Ойын-сауық"],["🚕","Транспорт"],["🏠","Үй"],
  ["👕","Киім"],["💊","Денсаулық"],["📚","Білім"],["📦","Басқа"]
];
const income=450000;
let tx=JSON.parse(localStorage.getItem("moneyflow_tx")||"[]");
let selected=null;
const $=id=>document.getElementById(id);
function money(n){return new Intl.NumberFormat("kk-KZ").format(n)+" ₸"}
function render(){
  const spent=tx.reduce((s,x)=>s+x.amount,0), balance=income-spent;
  $("income").textContent=money(income);$("spent").textContent=money(spent);$("balance").textContent=money(balance);
  $("progress").style.width=Math.min(100,spent/income*100)+"%";
  $("count").textContent=`${tx.length} төлем`;
  $("empty").style.display=tx.length?"none":"block";
  $("list").innerHTML=tx.slice().reverse().map(x=>`<div class="item"><div class="emoji">${x.icon}</div><div class="item-main"><b>${x.cat}</b><small>${x.time}</small></div><div class="item-amount">−${money(x.amount)}</div></div>`).join("");
}
function openSheet(){
  $("sheet").classList.remove("hidden");$("amount").focus();selected=null;
  document.querySelectorAll(".cat").forEach(e=>e.classList.remove("selected"));
  $("save").disabled=true;$("save").textContent="Категорияны таңда";
}
function closeSheet(){$("sheet").classList.add("hidden")}
function toast(t){$("toast").textContent=t;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),1800)}
cats.forEach(([icon,name])=>{const b=document.createElement("button");b.className="cat";b.innerHTML=`<span>${icon}</span>${name}`;b.onclick=()=>{selected={icon,cat:name};document.querySelectorAll(".cat").forEach(e=>e.classList.remove("selected"));b.classList.add("selected");updateSave()};$("cats").appendChild(b)});
function updateSave(){const a=Number($("amount").value);$("save").disabled=!(a>0&&selected);$("save").textContent=selected?`${money(a)} — ${selected.cat}`:"Категорияны таңда"}
$("amount").addEventListener("input",updateSave);
$("payBtn").onclick=openSheet;$("closeSheet").onclick=closeSheet;$("x").onclick=closeSheet;
$("save").onclick=()=>{const a=Number($("amount").value);if(!(a>0&&selected))return;tx.push({amount:a,...selected,time:new Date().toLocaleString("kk-KZ",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})});localStorage.setItem("moneyflow_tx",JSON.stringify(tx));render();closeSheet();$("amount").value="";toast(`✓ ${money(a)} қосылды`)};
$("resetBtn").onclick=()=>{if(confirm("Барлық тест шығындарын өшіру керек пе?")){tx=[];localStorage.removeItem("moneyflow_tx");render()}};
render();

// v0.2 — demo notification flow
(()=>{
 const notice=document.getElementById('notice'); if(!notice)return;
 const close=()=>notice.classList.add('hidden');
 document.getElementById('noticeClose').onclick=close;
 function show(type,amount){
  document.getElementById('noticeIcon').textContent=type==='transfer'?'💸':'💳';
  document.getElementById('noticeTitle').textContent=type==='transfer'?'Перевод жасадың':'Төлем жасадың';
  document.getElementById('noticeAmount').textContent=money(amount);
  document.getElementById('noticeQuestion').textContent=type==='transfer'?'Қайда жібердің?':'Қайда жұмсадың?';
  const list=type==='transfer'?[['👤 Досым','Досым'],['👨‍👩‍👧 Отбасы','Отбасы'],['🤝 Қарыз','Қарыз'],['📦 Басқа','Басқа']]:[['🛒 Азық-түлік','Азық-түлік'],['🎮 Ойын-сауық','Ойын-сауық'],['🚕 Транспорт','Транспорт'],['🏠 Үй','Үй']];
  const box=document.getElementById('noticeCats'); box.innerHTML=list.map(x=>`<button>${x[0]}</button>`).join('');
  box.querySelectorAll('button').forEach((b,i)=>b.onclick=()=>{close(); toast(`✓ ${money(amount)} → ${list[i][1]}`);});
  notice.classList.remove('hidden');
 }
 document.getElementById('demoPay').onclick=()=>show('expense',8500);
 document.getElementById('demoTransfer').onclick=()=>show('transfer',20000);
})();

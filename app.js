const $=id=>document.getElementById(id);
const CATS=[['🍔','Тамақ'],['🚕','Такси'],['🛍️','Сауда'],['🎮','Ойын-сауық'],['📚','Оқу'],['🏠','Үй'],['💊','Денсаулық'],['📦','Басқа']];
let data=JSON.parse(localStorage.getItem('moneyflow_v2')||'{"budget":500000,"balance":450000,"tx":[]}');
let pending=null;
const money=n=>n.toLocaleString('ru-RU')+' ₸';
function save(){localStorage.setItem('moneyflow_v2',JSON.stringify(data))}
function render(){
 const spent=data.tx.reduce((s,x)=>s+x.amount,0), left=data.budget-spent;
 $('balance').textContent=money(data.balance);
 $('spent').textContent=money(spent); $('count').textContent=data.tx.length; $('remaining').textContent=money(Math.max(0,left));
 $('bar').style.width=Math.min(100,spent/data.budget*100)+'%';
 $('list').innerHTML=data.tx.length?data.tx.map(x=>`<div class="item"><div class="dot">${x.icon}</div><div class="meta"><b>${x.cat}</b><span>${x.merchant} · ${x.time}</span></div><strong>−${money(x.amount)}</strong></div>`).join(''):'<div class="empty">Операциялар әзірге жоқ</div>';
 const sums={};data.tx.forEach(x=>sums[x.cat]=(sums[x.cat]||0)+x.amount);
 $('categories').innerHTML=Object.entries(sums).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<div class="catStat"><span>${k}</span><b>${money(v)}</b></div>`).join('')||'<div class="empty">Категориялар кейін пайда болады</div>';
}
function openTx(){
 const amount=[2500,4500,8500,12900,20000][Math.floor(Math.random()*5)], merchants=['Coffee House','Magnum','Yandex Go','Steam','Small Market'];
 pending={amount,merchant:merchants[Math.floor(Math.random()*merchants.length)],time:new Date().toLocaleTimeString('kk-KZ',{hour:'2-digit',minute:'2-digit'})};
 $('txAmount').textContent=money(amount);$('txMerchant').textContent=pending.merchant;$('txTime').textContent=pending.time;
 $('catButtons').innerHTML=CATS.map(c=>`<button data-cat="${c[1]}" data-icon="${c[0]}">${c[0]} ${c[1]}</button>`).join('');
 $('overlay').classList.add('show');
}
$('catButtons').onclick=e=>{let b=e.target.closest('button');if(!b)return;data.tx.unshift({amount:pending.amount,merchant:pending.merchant,time:pending.time,cat:b.dataset.cat,icon:b.dataset.icon});data.balance-=pending.amount;save();render();$('overlay').classList.remove('show');pending=null};
$('simulate').onclick=openTx;
$('close').onclick=$('later').onclick=()=>{$('overlay').classList.remove('show');pending=null};
$('clear').onclick=()=>{if(confirm('Барлық демо операцияларды өшіру керек пе?')){data={budget:500000,balance:450000,tx:[]};save();render()}};
$('auto').onchange=e=>{if(e.target.checked) alert('Авто-бақылау қосылды. Нақты банк интеграциясы үшін backend/webhook қажет.');};
$('push').onclick=async()=>{if(!('Notification'in window)){alert('Бұл браузер Notification API-ды қолдамайды.');return}let p=await Notification.requestPermission();alert(p==='granted'?'Push рұқсаты берілді. Серверлік push келесі қадамда қосылады.':'Push рұқсаты берілмеді.')};
$('settings').onclick=()=>alert('MoneyFlow v2 · Demo mode\\nКарта деректері сақталмайды.');
render();
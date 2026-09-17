# MoneyFlow v2

Көпшілікке шығаруға арналған MVP UI.

### Не жаңарды
- iPhone-ға ыңғайланған bottom-sheet popup
- транзакция: сома, merchant, уақыт
- категориялау
- localStorage арқылы деректерді сақтау
- баланс, бюджет, операция саны және категория статистикасы
- қауіпсіздік ескертуі
- Push permission сұрауы
- PWA manifest

### Нақты банк төлемін автоматты анықтау
GitHub Pages frontend басқа банк қолданбасының транзакциясын тікелей оқи алмайды. Production архитектура:
Bank/PSP API немесе Open Banking → backend/webhook → transaction event → Web Push → MoneyFlow.

Карта нөмірін, CVV немесе PIN-ді MoneyFlow серверінде сақтамау керек.

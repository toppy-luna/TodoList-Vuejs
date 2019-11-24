# TodoList-Vuejs
作成したコードを外部アクセス可能にするため、Amazon S3にアップしてあります。表示デザインは気にしない。
https://todolistvue.s3-ap-northeast-1.amazonaws.com/index.html

## ToDoリストを作ってみよう
1. 入力したらリアルタイムで表示される
データバインディングとv-modelという機能を使用する。v-xxxはディレクティブと呼ぶVueの機能。最終的にTodoリストには使用していない。

./js/main.js
```js
    data() {
        return {
            inputText: '',
        }
    },
```

./index.html
```html
    <div class="form">
      <div>{{ inputText }}</div>
      <input v-model="inputText" type="text">
    </div>
```

2. ToDoが表示される
リスト用データ配列を用意し、データ配列内のデータを表示するようにする

./js/main.js
```js
    data() {
        return {
            lists: [
                {
                    name: "ネギを買う",
                    isDone: false,
                },
                {
                    name: "テスト1",
                    isDone: true,
                },
        }
    },
```

./index.html
```html
    <div id="app">
        <ul class="lists">
            <li v-for="(list, index) in lists">
                <span>{{index}} - {{list.name}}</span>
            </li>
        </ul>
    </div>
```

3. ToDoの追加ができる
@clickでmethodのonAdd()をコールする。onAddには入力フォームのデータをリストデータに追加する処理を記載する。

./js/main.js
```js
    methods: {
        onAdd() {
            if (this.inputText) {// 入力フォームが空でなければ
                this.lists.push({
                    name: this.inputText,// 入力フォームから代入
                    isDone: false,// デフォルトは未完了
                });
                this.inputText = '';// 入力フォームをクリア
            }
        },
```

./index.html
```html
        <div class="form">
            <input v-model="inputText" type="text">
            <button @click="onAdd">追加</button>
        </div>
```

4. ToDoがないときは「なにもありません。」と表示される
v-if v-elseを使用する。Todoがないときはリストデータが空のとき。

./index.html
```html
        <ul class="lists" v-if="list.length"><!-- if(listが空)何もありません)-->
        <div v-else>
            何もありません
        </div>
```

5. ToDoを完了できる
checkboxをhtmlに追加し、v-modelでisDoneとデータバインディングする。

./index.html
```html
            <li v-for="(list, index) in lists">
                <input type="checkbox" v-model="list.isDone">
                <span>{{index}} - {{list.name}}</span>
                <span v-if="list.isDone">（済）</span>
            </li>
```

6. 削除ができる
削除ボタンを追加し、methodのonDeleteをコールする。そのとき削除行indexを渡す。

./js/main.js
```js
    methods: {
        onDelete(index) {
            this.lists.splice(index, 1)
        },
```

./index.html
```html
            <li v-for="(list, index) in getLists">
                <span>{{index}} - {{list.name}}</span>
                <button @click="onDelete(index)">削除</button>
            </li>
```

## おまけ
1. ToDoの数を表示する
リスト配列のサイズlists.lengthをhtmlで表示する。

./index.html
```html
            <div>リスト数は{{lists.length}}個です。</div>
```

2. 完了したToDoの数を表示する(computedを使う)
式をcomputedとして登録しておき、htmlで式を呼び出すことが出来る。ここでは、isDoneがtrueのリストをfileterし、そのサイズを返却している。

./js/main.js
```js
    computed: {
        getDoneNum() {
            return this.lists.filter(list => list.isDone === true).length;
        },
```

./index.html
```html
            <div>完了済みは{{getDoneNum}}個です。</div>
```

3. 完了したToDoだけを表示する機能を追加する
完了したTodoだけ表示するモードを追加し、ボタンで切り替えるようにする。完了したTodoだけ表示するときは、isDoneでfilterしたリストを返すcomputedのgetList()を使ってhtmlで描画する。

./js/main.js
```js
    computed: {
        getLists() {
            if (this.isDoneOnly) {
                return this.lists.filter(list => list.isDone === true);
            } else {
                return this.search(this.lists);
            }
        },
        getToggleButtonName() {
            if (this.isDoneOnly) {
                return "全てを表示";
            } else {
                return "完了を表示";
            }
        },
```

./index.html
```html
        <div class="form">
            <button @click="onToggleDone">{{getToggleButtonName}}</button>
        </div>
        <ul class="lists" v-if="getLists.length"><!-- getListで取得できるデータでifするように変更 -->
            <li v-for="(list, index) in getLists"><!-- getListがポイント -->
                <span>{{index}} - {{list.name}}</span>
            </li>
        </ul>
```

4. ToDoの検索（inputを用意してfilterをかけて表示）
methodに入力フォームと部分一致したリストを返すsearch()を追加し、getListが返すリストをsearchで返されたリストで、isDoneでfilterしたリストを返すように変更する。※searchかつisDoneでfilterしたリストが返るようにする。

./js/main.js
```js
    methods: {
        search(targets) {
            if (this.searchText) {
                return targets.filter(list => list.name.match(new RegExp(this.searchText)));
            } else {
                return targets;
            }
        }
    computed: {
        getLists() {
            if (this.isDoneOnly) {
                return this.search(this.lists.filter(list => list.isDone === true));
            } else {
                return this.search(this.lists);
            }
        },
```

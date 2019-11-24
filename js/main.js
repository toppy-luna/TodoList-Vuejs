const app = new Vue({
    el: '#app',
    data() {
        return {
            inputText: '',
            searchText: '',
            lists: [
                {
                    name: "ネギを買う",
                    isDone: false,
                },
                {
                    name: "テスト1",
                    isDone: true,
                },
                {
                    name: "テスト2",
                    isDone: true,
                },
                {
                    name: "電池を買う",
                    isDone: true,
                },
            ],
            isDoneOnly: false,
        }
    },
    methods: {
        onAdd() {
            if (this.inputText) {
                this.lists.push({
                    name: this.inputText,
                    isDone: false,
                });
                this.inputText = '';
            }
        },
        onDelete(index) {
            this.lists.splice(index, 1)
        },
        onToggleDone() {
            this.isDoneOnly = !this.isDoneOnly
        },
        search(targets) {
            if (this.searchText) {
                return targets.filter(list => list.name.match(new RegExp(this.searchText)));
            } else {
                return targets;
            }
        }
    },
    computed: {
        getDoneNum() {
            return this.lists.filter(list => list.isDone === true).length;
        },
        getLists() {
            if (this.isDoneOnly) {
                return this.search(this.lists.filter(list => list.isDone === true));
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
    },
})
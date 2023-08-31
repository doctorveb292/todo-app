(function() {
    let tasksArray = [];
    let listName = '';
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';
        button.disabled = true;

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        input.addEventListener('input', function() {
            if(input.value !== "") {
                button.disabled = false;
            } else {
                button.disabled = true;
            }
        });

        return {
            form,
            input,
            button,
        };
    }

    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    function createTodoItem(object) {

        let item = document.createElement('li');

        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deletButton = document.createElement('button');

        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = object.name;

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deletButton.classList.add('btn', 'btn-danger');
        deletButton.textContent = 'Удалить';


        if (object.done === true) {
           item.classList.add('list-group-item-success');
        }

        doneButton.addEventListener('click', function() {
            item.classList.toggle('list-group-item-success');

            for (let row of tasksArray) {
                if(row.id == object.id) {
                    row.done = !row.done
                };
                saveList(tasksArray, listName);
            }
        });

        deletButton.addEventListener('click', function() {
            if (confirm('Вы уверены?')) {
               item.remove();

            for (let i = 0; i < tasksArray.length; ++i) {
                if(tasksArray[i].id == object.id) {
                    tasksArray.splice(i, 1);
                }
            }
            saveList(tasksArray, listName);
            };
        });

        buttonGroup.append(doneButton);
        buttonGroup.append(deletButton);
        item.append(buttonGroup);

        return {
            item,
            doneButton,
            deletButton,
        };
    };

    function newId (array) {
        let max = 0;
        for (let item of array) {
        if (item.id > max) {
            max = item.id;
            }
        }
        return max + 1;
    };

    function saveList(array, keyName) {
        localStorage.setItem(keyName,JSON.stringify(array));
    };

    function createTodoApp(container, title = 'Список дел', keyName) {

        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        listName = keyName;

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        let localData = localStorage.getItem(listName);
        if (localData !== null && localData !== '') {
            tasksArray = JSON.parse(localData);
        };

        for (let itemList of tasksArray) {
            let todoItem = createTodoItem(itemList);
            todoList.append(todoItem.item);
        }

        todoItemForm.form.addEventListener('submit', function(e) {

            e.preventDefault();


            if (!todoItemForm.input.value) {
                return;
            };


            let newItem = {
                id: newId(tasksArray),
                name: todoItemForm.input.value,
                done: false,
            };

            let todoItem = createTodoItem(newItem);

            tasksArray.push(newItem);

            saveList(tasksArray, listName);

            todoList.append(todoItem.item);

            todoItemForm.button.disabled = true;

            todoItemForm.input.value = '';
        });
    }

    window.createTodoApp = createTodoApp;
})();


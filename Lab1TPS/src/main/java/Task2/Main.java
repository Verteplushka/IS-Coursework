package Task2;

public class Main {
    public static void main(String[] args) {
        BTreeOld tree = new BTreeOld();

        // 1. Установка максимального количества ключей в узле
        tree.setMaxKeys(3); // Устанавливаем максимальное количество ключей в узле равным 4

        // 2. Вставка элементов в дерево
        System.out.println("Вставка элементов в дерево:");
        int[] elements = {8, 13, 5,0,16,7,23,15};
        for (int key : elements) {
            tree.insert(key);
        }

        // 3. Вывод дерева
        System.out.println("Дерево после вставки элементов:");
        tree.printTree();

        // 4. Поиск элемента
        int searchKey = 15;
        System.out.println("Поиск элемента " + searchKey + ":");
        if (tree.search(searchKey)) {
            System.out.println("Элемент " + searchKey + " найден в дереве.");
        } else {
            System.out.println("Элемент " + searchKey + " не найден в дереве.");
        }

        // 5. Удаление элемента
        int deleteKey = 15;
        System.out.println("Удаление элемента " + deleteKey + ":");
        tree.delete(deleteKey);
        tree.printTree();

        // 6. Очистка дерева
        tree.clear();
        System.out.println("Дерево после очистки:");
        tree.printTree();
    }
}

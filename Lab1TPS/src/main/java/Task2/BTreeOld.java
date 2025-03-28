package Task2;

import java.util.*;

class BTreeOld {
    private int MAX_KEYS; // Максимальное количество ключей в узле

    private Node root;

    public BTreeOld() {
        MAX_KEYS = 3; // По умолчанию максимальное количество ключей в узле - 3
        root = new Node(true);
    }

    // Метод для изменения максимального количества ключей
    public void setMaxKeys(int maxKeys) {
        if (maxKeys <= 0) {
            throw new IllegalArgumentException("Максимальное количество ключей должно быть больше 0");
        }
        if (maxKeys > 5) {
            throw new IllegalArgumentException("Максимальное количество ключей должно быть меньше 5");
        }
        MAX_KEYS = maxKeys;
        root = new Node(true); // Очистить дерево при изменении
    }

    // Добавление элемента в дерево
    public void insert(int key) {
        if (root.keys.size() == MAX_KEYS) {
            Node newRoot = new Node(false);
            newRoot.children.add(root);
            split(newRoot, 0);
            root = newRoot;
        }
        insertNonFull(root, key);
    }

    private void insertNonFull(Node node, int key) {
        int i = node.keys.size() - 1;
        if (node.isLeaf) {
            while (i >= 0 && key < node.keys.get(i)) {
                i--;
            }
            node.keys.add(i + 1, key);
        } else {
            while (i >= 0 && key < node.keys.get(i)) {
                i--;
            }
            i++;
            if (node.children.get(i).keys.size() == MAX_KEYS) {
                split(node, i);
                if (key > node.keys.get(i)) {
                    i++;
                }
            }
            insertNonFull(node.children.get(i), key);
        }
    }

    private void split(Node parent, int index) {
        Node child = parent.children.get(index);
        Node newChild = new Node(child.isLeaf);
        int mid = child.keys.size() / 2;
        parent.keys.add(index, child.keys.get(mid));
        parent.children.add(index + 1, newChild);

        for (int i = mid + 1; i < child.keys.size(); i++) {
            newChild.keys.add(child.keys.get(i));
        }
        child.keys.subList(mid, child.keys.size()).clear();

        if (!child.isLeaf) {
            for (int i = mid + 1; i < child.children.size(); i++) {
                newChild.children.add(child.children.get(i));
            }
            child.children.subList(mid + 1, child.children.size()).clear();
        }
    }

    // Поиск элемента в дереве
    public boolean search(int key) {
        return search(root, key);
    }

    private boolean search(Node node, int key) {
        int i = 0;
        while (i < node.keys.size() && key > node.keys.get(i)) {
            i++;
        }
        if (i < node.keys.size() && key == node.keys.get(i)) {
            return true;
        }
        if (node.isLeaf) {
            return false;
        }
        return search(node.children.get(i), key);
    }

    // Удаление элемента из дерева
    public void delete(int key) {
        delete(root, key);
    }

    private void delete(Node node, int key) {
        int i = 0;
        while (i < node.keys.size() && key > node.keys.get(i)) {
            i++;
        }
        if (i < node.keys.size() && key == node.keys.get(i)) {
            if (node.isLeaf) {
                node.keys.remove(i);
            } else {
                Node child = node.children.get(i);
                if (child.keys.size() > MAX_KEYS / 2) {
                    node.keys.set(i, child.keys.get(child.keys.size() - 1));
                    delete(child, child.keys.get(child.keys.size() - 1));
                } else {
                    Node sibling = node.children.get(i + 1);
                    child.keys.add(node.keys.get(i));
                    node.keys.set(i, sibling.keys.get(0));
                    sibling.keys.remove(0);
                    delete(child, key);
                }
            }
        } else if (!node.isLeaf) {
            delete(node.children.get(i), key);
        }
    }

    // Очистить дерево
    public void clear() {
        root = new Node(true);
    }

    // Вспомогательный класс для узлов дерева
    private static class Node {
        boolean isLeaf;
        List<Integer> keys;
        List<Node> children;

        public Node(boolean isLeaf) {
            this.isLeaf = isLeaf;
            this.keys = new ArrayList<>();
            this.children = new ArrayList<>();
        }
    }

    // Метод для вывода дерева
    public void printTree() {
        printTree(root, "", true);
    }

    // Рекурсивный метод для обхода и вывода дерева
    private void printTree(Node node, String indent, boolean isLast) {
        System.out.println(indent + (isLast ? "└── " : "├── ") + node.keys);
        indent += isLast ? "    " : "│   ";
        for (int i = 0; i < node.children.size(); i++) {
            printTree(node.children.get(i), indent, i == node.children.size() - 1);
        }
    }
}

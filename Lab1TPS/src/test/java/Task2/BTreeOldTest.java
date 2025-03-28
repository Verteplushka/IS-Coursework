package Task2;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class BTreeOldTest {
    private BTreeOld tree;

    @BeforeEach
    void setUp() {
        tree = new BTreeOld();
    }

    @Test
    void testInsert() {
        tree.insert(10);
        tree.insert(20);
        tree.insert(5);
        tree.insert(6);
        tree.insert(12);
        tree.insert(30);
        tree.insert(7);
        tree.insert(17);

        System.out.println("Insert Test:");
        tree.printTree();

        assertTrue(tree.search(10));
        assertTrue(tree.search(20));
        assertTrue(tree.search(5));
        assertTrue(tree.search(6));
        assertTrue(tree.search(12));
        assertTrue(tree.search(30));
        assertTrue(tree.search(7));
        assertTrue(tree.search(17));
        assertFalse(tree.search(99));
    }

    @Test
    void testDelete() {
        int[] keys = {10, 20, 5, 6, 12, 30, 7, 17};
        for (int key : keys) {
            tree.insert(key);
        }

        System.out.println("Delete Test:");
        tree.delete(6);
        tree.printTree();
        assertFalse(tree.search(6));

        tree.delete(20);
        tree.printTree();
        assertFalse(tree.search(20));
    }

    @Test
    void testSetMaxKeys() {
        System.out.println("Change Max Keys Test:");
        tree.setMaxKeys(4);
        assertDoesNotThrow(() -> tree.insert(1));
        assertDoesNotThrow(() -> tree.insert(2));
        assertDoesNotThrow(() -> tree.insert(3));
        assertDoesNotThrow(() -> tree.insert(4));
        assertDoesNotThrow(() -> tree.insert(5));

        tree.printTree();
    }

    @Test
    void testClear() {
        tree.insert(1);
        tree.insert(2);
        tree.insert(3);

        tree.clear();
        assertFalse(tree.search(1));
        assertFalse(tree.search(2));
        assertFalse(tree.search(3));

        System.out.println("Clear Test:");
        tree.printTree();
    }

    @Test
    void testBoundaryCases() {
        System.out.println("Boundary Cases Test:");

        // Вставка в пустое дерево
        tree.insert(1);
        assertTrue(tree.search(1));

        // Вставка дублирующих значений
        tree.insert(1);
        tree.insert(1);
        assertTrue(tree.search(1));

        // Удаление несуществующего элемента
        tree.delete(99);
        assertFalse(tree.search(99));

        // Вставка минимального и максимального целого значения
        tree.insert(Integer.MIN_VALUE);
        tree.insert(Integer.MAX_VALUE);
        assertTrue(tree.search(Integer.MIN_VALUE));
        assertTrue(tree.search(Integer.MAX_VALUE));

        tree.printTree();
    }
}

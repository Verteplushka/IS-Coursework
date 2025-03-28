package Task3;

class Intonation {
    private String name; // Микромодуляция
    private int pause; // Длинна паузы
    private boolean canOffend; // Может обидеть

    public Intonation(String name, int pause, boolean canOffend) {
        this.name = name;
        this.pause = pause;
        this.canOffend = canOffend;
    }

    public String getModulation() {
        return name;
    }

    public void setModulation(String name) {
        this.name = name;
    }

    public int getPause() {
        return pause;
    }

    public void setPause(int pause) {
        this.pause = pause;
    }

    public boolean isCanOffend() {
        return canOffend;
    }

    public void setCanOffend(boolean canOffend) {
        this.canOffend = canOffend;
    }

    @Override
    public String toString() {
        String offenseMessage = canOffend ? "Это может обидеть." : "Ничего такого, что могло бы обидеть.";
        return name + " с паузой " + pause + " микросекунд. " + offenseMessage;
    }
}

public class MultiShape implements Shape {
    private List<Shape> shapelist;
    private String name;
    public MultiShape(String name){
        this.name = name;
        this.shapelist = new ArrayList<Shape>();
    }
    public void addShape(Shape shape){
        shapelist.add(shape);
    }
    public void drawShape(){
        shapelist.forEach(Shape::draw);
    }
    //Any other shape particular methods
} 

public class WrappedShape extends Shape {
    private Shape internalshape;
    private String frameType;

    public WrappedShape(String frameType){
        this.internalshape = new Shape();
        this.frameType = frameType;
    }
}

public class TestClone implements Cloneable{
    
}
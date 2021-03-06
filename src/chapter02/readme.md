# 图像学编程

## 2.1 Sierpinski镂垫
    Sierpinski镂垫的构造过程
- 1.在三角形内随机选择一个初始点p=（x,y,0）
- 2.随机选择这个三角形的其中一个顶点
- 3.找出p和随机选择的这个顶点之间的中点q
- 4.把这个中点q所对应的位置用标记显示出来
- 5.用这个中点q替换p
- 6.转步骤2


    【立即绘制模式】
    这种方法不需要将每次生成的点都发送到图形处理单元中，从而减少时间开销，但需要存储所有的数据，增加了空间开销。

    使用立即绘制模式所带来的问题是我们没有使用额外的内存空间来存储需要绘制的几何数据。如果需要再次绘制显示这些点的话，就必须重新计算这些点才能将它们显示出来。

    伪代码：
```

funtction sierpinski(){
    initialize_the_point();
    p = find_initialize_point();

    for(some_number_of_points){
        q = generate_a_point(p);
        display_the_point(q);//直接绘制
        p = q;
    }

    cleanup();
}

```
    【延迟绘制模式】
    数据存储在一个数据结构中，所以不用重新计算就可以再次显示这些数据。

    每当对象在一个新的位置上显示，我们需要把所有需要显示的点从CPU发送到GPU中。如果数据量非常大，那么从CPU到GPU的数据传输会成为显示处理的一个瓶颈。

    伪代码：
```

function sierpinski(){
    initalize_the_system();
    p = find_initialize_point();

    for(some_number_of_points){
        q = generate_a_point(p);
        store_the_point(q);//储存
        p = q;
    }

    display_all_points();//绘制
    cleanup();
}

```

    第三种处理策略
    首先把数据发送并存储到GPU中，然后在GPU中显示这些已存储的数据。
    
    如果这些数据只需要显示一次，并没有什么优势。但是如果以动画的形式显示这些数据，那么由于这些数据已经存储在GPU中，所以重新显示这些数据不需要额外的数据传输开销，而只需要调用一个简单的函数就可以修改对象移动后的空间位置数据。
    
    伪代码：
```

function sierpinski(){
    initalize_the_system();
    p = find_initialize_point();

    for(some_number_of_points){
        q = generate_a_point(p);
        store_the_point(q);//储存
        p = q;
    }

    send_all_points_to_GPU();
    display_data_on_GPU();//绘制
    cleanup();
}

```

## 2.2 编写二维图形应用程序
    在WebGL中，术语顶点和点的含义并不完全相同。一个顶点是空间中的一个位置，可以利用顶点来定义图形系统可识别的基本几何图元。

## 2.3 WebGL应用程序编程接口

### 2.3.1 图形函数
    图形软件包的基本模型是一个黑盒子，它的性质只能通过输入和输出来描述。
    
    输入就是函数调用，输出就是显示在浏览器上的图元。
    
    图形系统需要执行多个任务来生成图形输出和处理用户的输入。

- 图元函数
- 属性函数
- 观察函数
- 变换函数
- 输入函数
- 控制函数
- 查询函数
  
  图元函数定义了系统可以显示的低级对象或者最基本的实体。视API的不同，图元可以包括点、线段、多边形、像素、文本和各种类型的曲面。WebGL只直接支持非常有限的图元集，比如点、线段和三角形。

  属性就是API控制图元在显示器上显示的方式。在WebGL中，可以通过应用程序把颜色信息传送给着色器来设置图形的颜色，也可以让着色器通过使用光照模型来计算颜色，光照模型需要使用光源数据和模型表面的材质属性。

  通过调用观察函数可以指定各种视图，尽管不同的API在选择视图的灵活性方面有所不同。WebGL没有提供任何观察函数，而是通过在应用程序或者着色器中使用各种几何变换来得到希望的视图。

  变换函数可以让用户对对象进行诸如旋转、平移和缩放之类的变换。在WebGL中，首先在应用程序中生成所需的变换矩阵，然后在WebGL应用程序或者着色器中执行变换。

  输入函数用来接收来自键盘、鼠标和数位板等设备的输入。

  控制函数使我们能够与窗口系统通信，初始化我们的程序，以及处理在程序执行期间发生的任何错误。

  查询函数提供API的其他信息，包括照相机的参数或者帧缓存中的值。

### 2.3.2 图形绘制流水线和状态机
    我们把整个图形系统看成是一个状态机，即一个包含有限状态机的黑盒子。这个状态机的输入来自应用程序。这些输入可以改变机器的状态或者使机器产生可见的输出。

    从API的角度来看，图形函数有两类：一类函数定义图元（图元要在状态机内部的绘制流水线上进行处理）；另一类函数改变机器的状态。

    WebGL中的参数大多数都是持续性的，它们的值保持不变，除非我们通过调用改变状态的函数来显式地改变它们。

### 2.3.3 OpenGL 和 WebGL
    略

### 2.3.4 WebGL接口
    略

### 2.3.5 坐标系
    用户的坐标系称为世界坐标系、应用程序坐标系或者对象坐标系。我们把应用程序中度量顶点位置的数值称为顶点坐标。用显示器上的单位度量出的数值起初叫做物理设备坐标或者设备坐标。

## 2.4 图元和属性
    API支持图元的方式目前倾向于支持最小图元集。【图形硬件的发展因素导向】

    我们把图元分成两类：几何图元和图像图元【光栅图元】
    （光栅图元的一个例子是像素阵列，它不具有几何属性，我们不能对像几何图元那样对光栅图元进行几何操作。光栅图元需要经过另一条流水线的处理，这条流水线与几何流水线并行，终点也是帧缓存。）

    基本的WebGL几何图元是由顶点集合来确定的。所有的WebGL几何图元都是由点、线段和三角形这样的基本图形构成的。

- 点（gl.POINTS）:每个顶点被显示的大小至少是一个像素。
- 线段（gl.LINES）:这种图元把相继的顶点配对后解释成线段的两个端点。相继的线段一般不相连，因为顶点是两两配对来处理的。
- 折线（gl.LINE_STRIP,gl.LINE_LOOP）:要想让相继的顶点（以及线段）相连，可以使用折线图元。许多曲线可以通过合适的折线来近似。如果希望折线闭合，可以把最后一个顶点设置成与第一个顶点重合，也可以使用gl.LINE_LOOP类型，它会在最后一个顶点和第一个顶点之间画一条线段，于是得到一条闭合的环路。






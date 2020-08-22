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
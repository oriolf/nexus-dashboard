package main

import (
	"log"

	"github.com/jaracil/ei"
	"github.com/nayarsystems/nxsugar-go"
)

func main() {
	server, err := nxsugar.NewServerFromConfig()
	if err != nil {
		log.Fatalln("Could not create server:", err)
	}

	servicefib, err := server.AddService("fib")
	if err != nil {
		log.Fatalln("Could not create service fibonacci:", err)
	}

	servicesquare, err := server.AddService("square")
	if err != nil {
		log.Fatalln("Could not create service square:", err)
	}

	err = servicefib.AddMethodSchema("compute", &nxsugar.Schema{FromFile: "fib.json"}, fib)
	if err != nil {
		log.Fatalln("Could not add method to service fib:", err)
	}

	err = servicesquare.AddMethodSchema("compute", &nxsugar.Schema{FromFile: "square.json"}, square)
	if err != nil {
		log.Fatalln("Could not add method to service square:", err)
	}

	server.Serve()
}

func fib(task *nxsugar.Task) (interface{}, *nxsugar.JsonRpcErr) {
	n := ei.N(task.Params).M("n").IntZ()
	var r []int
	for i, j := 0, 1; j < n; i, j = i+j, i {
		r = append(r, i)
	}
	return r, nil
}

func square(task *nxsugar.Task) (interface{}, *nxsugar.JsonRpcErr) {
	n := ei.N(task.Params).M("n").IntZ()
	return n * n, nil
}
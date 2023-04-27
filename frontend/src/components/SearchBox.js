import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/esm/Container";

export default function SearchBox() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/search/?query=${query}` : "/search");
  };
  return (
    // <Form className="d-flex me-auto" onSubmit={submitHandler}>
    //   {/* <InputGroup>
    //     <FormControl type="text" name="q" id="q" onChange={(e) => setQuery(e.target.value)} placeholder="search products..." aria-label="Search Products" aria-describedby="button-search"></FormControl>
    //   </InputGroup> */}
    //   <Button variant="light" type="submit" id="button-search">
    //     <i className="fas fa-search"></i>
    //   </Button>
    // </Form>
    <Container className="search-cont">
      <Form className="search" id="search-bar" onSubmit={submitHandler}>
        <InputGroup>
          {/* <FormControl type="text" name="q" id="q" onChange={(e) => setQuery(e.target.value)} placeholder="search products..." aria-label="Search Products" aria-describedby="button-search"></FormControl> */}
          <FormControl type="search" name="q" placeholder="search products..." className="search__input" onChange={(e) => setQuery(e.target.value)} aria-label="Search Products" aria-describedby="button-search"></FormControl>
        </InputGroup>
        <Button variant="light" type="submit" className="search__button" id="search__button">
          <i className="fas fa-search search__icon"></i>
        </Button>
      </Form>
    </Container>
  );
}

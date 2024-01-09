import React, { useState, useEffect, useContext } from 'react';
import { FormControl, ListGroup } from 'react-bootstrap';
import axiosInstance from '../../utils/axiosUtil';
import { ToastContainer, toast } from 'react-toastify';
import { toastOptions } from '../../utils/error';
import { Store } from '../../states/store';

const AutocompleteSearch = ({ onSelect, searchType }) => {
  console.log({ onSelect })
  const [selectedItem, setSelectedItem] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);

  const { state } = useContext(Store);
  const { token } = state;

  useEffect(() => {
    // Call your API here with the updated search term
    // and update the filtered options based on the API response
    if (searchTerm) {
      (async () => {
        try {
          switch (searchType) {
            case "warehouse":
              var { data } = await axiosInstance(`/api/warehouse/?keyword=${searchTerm}`);
              setFilteredOptions(data.warehouses);
              break;

            case "user":
              var { data } = await axiosInstance(`/api/admin/users/?keyword=${searchTerm}&role=user`, {
                headers: { Authorization: token }
              });
              console.log(data)
              setFilteredOptions(data.users);
              break;

            case "controller":
              var { data } = await axiosInstance(`/api/admin/users/?keyword=${searchTerm}&role=controller`, {
                headers: { Authorization: token }
              });
              console.log(data)
              setFilteredOptions(data.users);
              break;

            case "manager":
              var { data } = await axiosInstance(`/api/admin/users/?keyword=${searchTerm}&role=manager`, {
                headers: { Authorization: token }
              });
              console.log(data)
              setFilteredOptions(data.users);
              break;

            case "order":
              var { data } = await axiosInstance(`/api/admin/orders/?orderId=${searchTerm}`, {
                headers: { Authorization: token }
              });
              console.log(data)
              setFilteredOptions(data.orders);

            default:
              return;
          }
        } catch (error) {
          toast.error(error, toastOptions);
        }
      })();
    } else setFilteredOptions([]);
  }, [searchTerm, searchType]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setSelectedItem(null);
  };

  const handleSelectOption = (option) => {
    console.log({ option })
    setSearchTerm('');
    onSelect(option);
    setFilteredOptions([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      if (!selectedItem) setSelectedItem(filteredOptions.length - 1);
      else setSelectedItem(selectedItem - 1);
    } else if (e.key === 'ArrowDown') {
      console.log({ selectedItem })
      setSelectedItem((prev) => {
        if (prev === filteredOptions.length - 1 || prev === null) return 0;
        return prev + 1;
      });
    }
  };

  console.log({ filteredOptions })
  return (
    <div style={{ position: "relative" }}>
      <FormControl
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={handleSearch}
        onKeyDown={handleKeyDown}
      />
      {filteredOptions.length > 0 && (
        <ListGroup className="autocomplete-list">
          {searchType === 'warehouse' && filteredOptions.map((warehouse, idx) => {
            const { id, name, image, manager, controller } = warehouse;
            console.log(idx, selectedItem);
            return (
              <ListGroup.Item
                className={`autocomplete-item ${idx === selectedItem ? 'selected' : ''}`}
                key={id}
                onClick={() => handleSelectOption(warehouse)}
              >
                <div className='d-flex '>
                  <div className='me-3'>
                    <img src={image} alt="img" width={50} height={50} />
                  </div>
                  <div className='w-100'>
                    <span style={{ fontWeight: "700" }}>{name}</span>
                    <hr style={{ margin: "0px", color: "#36454F" }} />
                    <span style={{ fontSize: "0.9rem" }}>{manager?.fullname}</span>
                    <hr style={{ margin: "0px", color: "#36454F" }} />
                    <span style={{ fontSize: "0.9rem" }}>{controller?.fullname}</span>
                    <hr style={{ margin: "0px", color: "#36454F" }} />
                  </div>
                </div>
              </ListGroup.Item>
            )
          })}

          {['user', 'manager', 'controller'].includes(searchType) && filteredOptions.map((user, idx) => {
            const { id, fullname, avatar, email, mobile_no, city, country } = user;
            console.log(idx, selectedItem);
            return (
              <ListGroup.Item
                className={`autocomplete-item ${idx === selectedItem ? 'selected' : ''}`}
                key={id}
                onClick={() => handleSelectOption(user)}
              >
                <div className='d-flex '>
                  <div className='me-3'>
                    <img src={avatar} alt="img" width={50} height={50} />
                  </div>
                  <div className='w-100'>
                    <span style={{ fontWeight: "700" }}>{fullname}</span>
                    <hr style={{ margin: "0px", color: "#36454F" }} />
                    <span style={{ fontSize: "0.9rem" }}>{`${city}, ${country}`}</span>
                    <hr style={{ margin: "0px", color: "#36454F" }} />
                    <span style={{ fontSize: "0.9rem" }}>{email}</span>
                    <hr style={{ margin: "0px", color: "#36454F" }} />
                    <span style={{ fontSize: "0.9rem" }}>{mobile_no}</span>
                    <hr style={{ margin: "0px", color: "#36454F" }} />
                  </div>
                </div>
              </ListGroup.Item>
            )
          })}

          {searchType === 'order' && filteredOptions.map((order, idx) => {
            const { id, user, warehouse } = order;
            console.log(idx, selectedItem);
            return (
              <ListGroup.Item
                className={`autocomplete-item ${idx === selectedItem ? 'selected' : ''}`}
                key={id}
                onClick={() => handleSelectOption(order)}
              >
                <div className='d-flex '>
                  <div className='me-3'>
                    <img src={user?.avatar} alt="img" width={50} height={50} />
                  </div>

                  <div className='w-100'>
                    <span><b>Order Id - {order.id}</b></span>
                    <hr style={{ margin: "0px", color: "#36454F" }} />
                    <span style={{ fontSize: "0.9rem" }}><b>Qty: </b>{order.items?.length}</span>
                    <hr style={{ margin: "0px", color: "#36454F" }} />
                    <span style={{ fontSize: "0.9rem" }}><b>Status: </b>{order.status}</span>
                    <hr style={{ margin: "0px", color: "#36454F" }} />
                    <span style={{ fontSize: "0.9rem" }}><b>User: </b>{user?.fullname}</span>
                    <hr style={{ margin: "0px", color: "#36454F" }} />
                    <span style={{ fontSize: "0.9rem" }}><b>Warehouse: </b>{warehouse?.name}</span>
                    <hr style={{ margin: "0px", color: "#36454F" }} />
                  </div>
                </div>
              </ListGroup.Item>
            )
          })}
        </ListGroup>
      )}
      <ToastContainer />
    </div>
  );
};

export default AutocompleteSearch;

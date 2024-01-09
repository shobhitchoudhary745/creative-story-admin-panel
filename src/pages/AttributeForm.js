import React, { useState } from 'react'
import { Accordion, Button, Col, Row } from 'react-bootstrap';
import { CheckInput, Code, RadioInput, SelectInput, TextInput } from '../components';
import { toast } from 'react-toastify';
import { toastOptions } from '../utils/error';
import { FaEdit } from 'react-icons/fa';

function getRandomColor(opacity = 1) {
  const letters = '0123456789ABCDEF';
  let color = '#';

  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0');
  color += alpha;

  return color;
};

const tab = (times) => {
  return `\t`.repeat(times);
}

function getAttrCode(attr, times = 0) {
  let code = '';
  console.log({ code, attr, times });
  attr.forEach((at) => {
    console.log({ at })
    code += at.key ? `\n${tab(times + 1)}${at.key}: ` : `\n${tab(times + 1)}`;
    switch (at.type) {
      case "Object":
        code += '{';
        break;
      case "Array":
        code += '[';
        break;
      default:
        code += `{\n\t${tab(times + 1)}type: `;
        break;
    }
    // code += at.type !== 'Object' ? `{\n\t${tab(times + 1)}type: ` : '{';

    console.log({ code, type: at.type });

    switch (at.type) {
      case 'Object':
        code += getAttrCode(at.subAttr, times + 1);
        break;

      case 'Array':
        code += getAttrCode(at.subAttr, times + 1);
        break;

      case 'Enum':
        code += `String,`;

        if (at.default) code += `\n\t${tab(times + 1)}default: ${at.default},`;
        code += `\n\t${tab(times + 1)}enum: [${at.enum.join(",")}]`;
        break;

      case 'Boolean':
        code += `Boolean,`;
        if (at.default) code += `\n\t${tab(times + 1)}default: ${at.default === 'True' ? true : false},`;
        break;

      case 'String':
        code += `String,`;
        if (at.default) code += `\n\t${tab(times + 1)}default: ${at.default},`;
        if (at.minLength.val && at.minLength.val >= 0) {
          if (at.minLength.msg) {
            code += `\n\t${tab(times + 1)}minLength: [${at.minLength.val}, "${at.minLength.msg}"],`
          } else {
            code += `\n\t${tab(times + 1)}minLength: ${at.minLength.val},`
          }
        }

        if (at.maxLength.val && at.maxLength.val >= 0) {
          if (at.maxLength.msg) {
            code += `\n\t${tab(times + 1)}maxLength: [${at.maxLength.val}, "${at.maxLength.msg}"],`
          } else {
            code += `\n\t${tab(times + 1)}maxLength: ${at.maxLength.val},`
          }
        }
        break;

      case 'Number':
        code += `Number,`;
        if (at.default) code += `\n\t${tab(times + 1)}default: ${at.default},`;
        if (at.min.val && at.min.val >= 0) {
          if (at.min.msg) {
            code += `\n\t${tab(times + 1)}min: [${at.min.val}, "${at.min.msg}"],`
          } else {
            code += `\n\t${tab(times + 1)}min: ${at.min.val},`
          }
        }

        if (at.max.val && at.max.val >= 0) {
          if (at.max.msg) {
            code += `\n\t${tab(times + 1)}max: [${at.max.val}, "${at.max.msg}"],`
          } else {
            code += `\n\t${tab(times + 1)}max: ${at.max.val},`
          }
        }
        break;

      case "mongoose.Schema.Types.ObjectId":
        code += `mongoose.Schema.Types.ObjectId,`
        if (at.ref)
          code += `\n\t${tab(times + 1)}ref: "${at.ref}",`
        break;

      default:
        code += `{\n\t${tab(times + 1)}${at.type},`;
        break;
    }

    if (at.required.val) {
      if (at.required.msg)
        code += `\n\t${tab(times + 1)}required: [true, "${at.required.msg}"],`;
      else
        code += `\n\t${tab(times + 1)}required: true,`;
    }

    code += `\n${tab(times + 1)}${at.type === "Array" ? ']' : '}'},`;
  });

  return code;
}

const AttributeForm = ({ attr, setAttr }) => {
  const [enumVal, setEnumVal] = useState("");
  const subAttrData = {
    type: "",
    key: "",
    required: {
      val: false,
      msg: "",
    },
    maxLength: {
      val: "",
      msg: "",
    },
    minLength: {
      val: "",
      msg: "",
    },
    max: {
      val: "",
      msg: "",
    },
    min: {
      val: "",
      msg: "",
    },
    unique: "",
    default: "",
    enum: "",
    subAttr: [],
    isArrayOpen: true,
    ref: "",
  };
  const [subAttribute, setSubAttribute] = useState(subAttrData);

  const handleInput = (e) => {
    setSubAttribute({ ...subAttribute, [e.target.name]: e.target.value });
  }

  const addAttr = async () => {
    console.log({ subAttribute })
    if (!subAttribute.type) {
      toast.warning(`Please select attribute type.`, toastOptions);
      return;
    }

    if (attr.type !== "Array" && !subAttribute.key) {
      toast.warning(`Please add the attribute.`, toastOptions);
      return;
    }

    if (subAttribute.type === 'Enum' && subAttribute.enum.length <= 0) {
      toast.warning(`Please add the enum values.`, toastOptions);
      return;
    }

    if (attr.type === "Array") {
      setAttr({ ...attr, subAttr: [...attr.subAttr, { ...subAttribute }], isArrayOpen: false })
    }

    if (attr.type === "Object") {
      setAttr({ ...attr, subAttr: [...attr.subAttr, { ...subAttribute }] })
    }

    setSubAttribute(subAttrData);
    setEnumVal("");
  }

  const handleRequired = (e) => {
    console.log({ e, subAttribute })
    if (!e.target.checked) {
      console.log({ e: e.target.checked });
      setSubAttribute({ ...subAttribute, required: { msg: "", val: e.target.checked } });
      return;
    }
    setSubAttribute({ ...subAttribute, required: { ...subAttribute.required, val: e.target.checked } });
  }

  const handleEnumValue = (e) => {
    setEnumVal(e.target.value);
    const val = e.target.value.split(',').filter(v => v && v.length > 0).map(v => `'${v.trim()}'`);

    console.log({ val })
    if (val.length > 0) {
      setSubAttribute({ ...subAttribute, enum: val });
    }
  }

  return (
    <div style={{ backgroundColor: getRandomColor(0.1), border: "1px solid #a5a0a0", borderRadius: "1rem", padding: "1rem", marginBottom: "1rem" }}>
      <h5 className='mb-3'>{attr.type === "Object" ? "Object Attributes" : attr.type === "Array" ? "Array Items" : ""} </h5>
      <Row className='m-0'>
        {attr.type === "Object" && <>
          <Col md={4}>
            <TextInput
              label='Key'
              name="key"
              value={subAttribute.key}
              onChange={handleInput}
            />
          </Col>
          <Col md={4}>
            <SelectInput
              col=""
              label="Key Type"
              placeholder="Select Key Type"
              value={subAttribute.type}
              name='type'
              onChange={handleInput}
              options={[{ String: "String" }, { Number: "Number" }, { Array: "Array" }, { "Object": "Object" }, { Enum: "Enum" }, { Boolean: "Boolean" }, { "mongoose.Schema.Types.ObjectId": "ObjectId" }]}
            />
          </Col>

        </>}

        {attr.type === "Array" && <>
          <Col md={4}>
            <SelectInput
              col=""
              label="Array Item Type"
              placeholder="Select Item Type"
              value={subAttribute.type}
              name='type'
              onChange={handleInput}
              options={[{ String: "String" }, { Number: "Number" }, { Array: "Array" }, { "Object": "Object" }, { Enum: "Enum" }, { Boolean: "Boolean" }, { "mongoose.Schema.Types.ObjectId": "ObjectId" }]}
            />
          </Col>
          {/* <Col md={4}>
            <TextInput
              label='Key'
              name="key"
              value={subAttribute.key}
              onChange={handleInput}
            />
          </Col> */}
        </>}
        {/* <Col md={4}>
          <TextInput
            label='Attribute'
            name="key"
            value={subAttribute.key}
            onChange={handleInput}
          />
        </Col> */}
        <Col md={4}>
          <CheckInput
            checklabel='Required'
            checked={subAttribute.required.val}
            onChange={handleRequired}
          />
        </Col>
        {subAttribute.required.val &&
          <Col sm={12}>
            <TextInput
              label='Required Message'
              value={subAttribute.required.msg}
              onChange={(e) => { setSubAttribute({ ...subAttribute, required: { ...subAttribute.required, msg: e.target.value } }); }}
            />
          </Col>
        }
        {(() => {
          switch (subAttribute.type) {
            case "Array":
              return (
                <>
                  {subAttribute.isArrayOpen ? <AttributeForm attr={subAttribute} setAttr={setSubAttribute} /> : subAttribute.subAttr.length === 1 && <Row>
                    <Col md={6}>
                      <TextInput label='Array Item Type' value={subAttribute.subAttr[0].type} />
                    </Col>
                    <Col>
                      <Button style={{ marginTop: "1.9rem" }} variant='light' onClick={() => { setSubAttribute({ ...subAttribute, subAttr: [], isArrayOpen: true }) }}><FaEdit /></Button>
                    </Col>
                  </Row>}
                </>
              )

            case "Object":
              return (
                <>
                  <Accordion defaultActiveKey={0}>
                    {subAttribute.subAttr.map((a, i) =>
                      <Accordion.Item key={i} eventKey={i}>
                        <Accordion.Header><h5 className='m-0'>Field {i + 1}</h5></Accordion.Header>
                        <Accordion.Body>{
                          console.log({ a })}
                          <Code code={getAttrCode([a])} />
                        </Accordion.Body>
                      </Accordion.Item>
                    )}
                  </Accordion>
                  <AttributeForm attr={subAttribute} setAttr={setSubAttribute} />
                </>
              )

            case "Enum":
              return (<>
                <Row>
                  <Col>
                    <TextInput
                      label="Enum Values seperated with comma (,)"
                      name='enum'
                      value={enumVal}
                      onChange={(e) => { handleEnumValue(e); }}
                    />
                  </Col>
                </Row>
                <Row>
                  {subAttribute.enum && subAttribute.enum.length > 0 &&
                    subAttribute.enum.map(v =>
                      <Col md={2}>
                        <RadioInput
                          inline
                          label={v}
                          name="default"
                          value={v}
                          onChange={handleInput}
                        />
                      </Col>
                    )}
                </Row>
              </>)

            case "Boolean":
              return (
                <Row>
                  {[true, false].map(bool =>
                    <Col md={2}>
                      <RadioInput
                        inline
                        label={bool ? "True" : "False"}
                        name="default"
                        value={bool}
                        onChange={handleInput}
                      />
                    </Col>
                  )}
                </Row>
              )

            case "String":
              return (
                <>
                  <Row>
                    <Col md={4}>
                      <TextInput
                        type='number'
                        label="Min Len"
                        value={subAttribute.minLength.val}
                        onChange={(e) => { setSubAttribute({ ...subAttribute, minLength: { ...subAttribute.minLength, val: e.target.value } }); }}
                      />
                    </Col>
                    {subAttribute.minLength.val && <Col md={8}>
                      <TextInput
                        label="Min Length error message"
                        value={subAttribute.minLength.msg}
                        onChange={(e) => { setSubAttribute({ ...subAttribute, minLength: { ...subAttribute.minLength, msg: e.target.value } }); }}
                      />
                    </Col>}
                  </Row>
                  <Row>
                    <Col md={4}>
                      <TextInput
                        type='number'
                        label="Max Len"
                        value={subAttribute.maxLength.val}
                        onChange={(e) => { setSubAttribute({ ...subAttribute, maxLength: { ...subAttribute.maxLength, val: e.target.value } }); }}
                      />
                    </Col>
                    {subAttribute.maxLength.val && <Col md={8}>
                      <TextInput
                        label="Max Length error message"
                        value={subAttribute.maxLength.msg}
                        onChange={(e) => { setSubAttribute({ ...subAttribute, maxLength: { ...subAttribute.maxLength, msg: e.target.value } }); }}
                      />
                    </Col>}
                  </Row>
                  <Row>
                    <Col md={6}>
                      <TextInput
                        label="Default Value"
                        value={subAttribute.default}
                        onChange={(e) => { setSubAttribute({ ...subAttribute, default: e.target.value }); }}
                      />
                    </Col>
                  </Row >
                </>
              )

            case "Number":
              return (
                <>
                  <Row>
                    <Col md={4}>
                      <TextInput
                        type='number'
                        label="Min Value"
                        value={subAttribute.min.val}
                        onChange={(e) => { setSubAttribute({ ...subAttribute, min: { ...subAttribute.min, val: e.target.value } }); }}
                      />
                    </Col>
                    {subAttribute.min.val && <Col md={8}>
                      <TextInput
                        label="Min Value error message"
                        value={subAttribute.min.msg}
                        onChange={(e) => { setSubAttribute({ ...subAttribute, min: { ...subAttribute.min, msg: e.target.value } }); }}
                      />
                    </Col>}
                  </Row>
                  <Row>
                    <Col md={4}>
                      <TextInput
                        type='number'
                        label="Max Value"
                        value={subAttribute.max.val}
                        onChange={(e) => { setSubAttribute({ ...subAttribute, max: { ...subAttribute.max, val: e.target.value } }); }}
                      />
                    </Col>
                    {subAttribute.max.val && <Col md={8}>
                      <TextInput
                        label="Max Value error message"
                        value={subAttribute.max.msg}
                        onChange={(e) => { setSubAttribute({ ...subAttribute, max: { ...subAttribute.max, msg: e.target.value } }); }}
                      />
                    </Col>}
                  </Row>
                  <Row>
                    <Col md={6}>
                      <TextInput
                        label="Default Value"
                        value={subAttribute.default}
                        onChange={(e) => { setSubAttribute({ ...subAttribute, default: e.target.value }); }}
                      />
                    </Col>
                  </Row >
                </>
              )

            case "mongoose.Schema.Types.ObjectId":
              return (
                <Row>
                  <Col>
                    <TextInput
                      label="Reference"
                      name="ref"
                      value={subAttribute.ref}
                      onChange={handleInput}
                    />
                  </Col>
                </Row>
              )

            default:
              break;
          }
        })()}
      </Row>
      <Button variant='info' onClick={addAttr}>{attr.type === "Array" ? "Set Item Type" : "Add Field"}</Button>
    </div>
  )
}

export default AttributeForm
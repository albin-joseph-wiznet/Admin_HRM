import React, { Component } from "react";
import XLSX from "xlsx";
import { make_cols } from "./MakeColumn";
import { SheetJSFT } from "./types";
import { ToastContainer, toast } from "react-toastify";
import Uploadimg from "../../Images/upload.jpg";

class ExcelReaderForPay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: {},
      data: [],
      cols: [],
    };
    this.handleFile = this.handleFile.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const files = e.target.files;
    if (files && files[0]) this.setState({ file: files[0] });

    let _validFileExtensions = [".xlsx", ".xlsm", ".xltx", ".xltm", ".csv"];

    if (e.target.type == "file") {
      let sFileName = e.target.value;
      if (sFileName.length > 0) {
        let blnValid = false;
        for (let j = 0; j < _validFileExtensions.length; j++) {
          let sCurExtension = _validFileExtensions[j];
          if (
            sFileName
              .substr(
                sFileName.length - sCurExtension.length,
                sCurExtension.length
              )
              .toLowerCase() == sCurExtension.toLowerCase()
          ) {
            blnValid = true;
            break;
          }
        }

        if (!blnValid) {
          toast.error(
            "Sorry, " +
              sFileName +
              " is invalid, allowed extensions are: " +
              _validFileExtensions.join(", "),
            {
              position: "top-right",
              autoClose: 6000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            }
          );
          e.target.value = "";
          return false;
        }
      }
    }
    return true;
  }

  handleFile() {
    /* Boilerplate to set up FileReader */
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;

    reader.onload = (e) => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, {
        type: rABS ? "binary" : "array",
        bookVBA: true,
      });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws);
      /* Update state */
      this.setState({ data: data, cols: make_cols(ws["!ref"]) }, () => {
        console.log(JSON.stringify(this.state.data, null, 2));
      });
    };

    if (rABS) {
      reader.readAsBinaryString(this.state.file);
    } else {
      reader.readAsArrayBuffer(this.state.file);
    }
  }

  render() {
    return (
      <div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange
          draggable
          pauseOnHover
        />

        <input
          type="file"
          id="file"
          // className="fileip form-control mt-4 ml-3 mr-3"
          className="form-control"
          placeholder="Update Excel here"
          accept={SheetJSFT}
          onChange={this.handleChange}
        />
        <button
          className="btn primary_light"
          type="button"
          onClick={this.handleFile}
        >
          Bulk Upload Payroll
        </button>

        <div className="uploadbox mt-4">
          <UploadPreview />
        </div>
      </div>
    );
  }
}
class UploadPreview extends React.Component {
  constructor(props) {
    super(props);

    this.state = { file: null };
    this.onChange = this.onChange.bind(this);
    this.resetFile = this.resetFile.bind(this);
  }
  onChange(event) {
    this.setState({
      file: URL.createObjectURL(event.target.files[0]),
    });
  }

  resetFile(event) {
    event.preventDefault();
    this.setState({ file: null });
  }
  render() {
    return (
      <div>
        <div>
          {this.state.file == null ? (
            <img className="image mt-3 mb-2" src={Uploadimg} />
          ) : (
            <img className="image mt-3 mb-2" src={this.state.file} />
          )}
        </div>
        {/*
        {this.state.file && (
          <div>
            <button onClick={this.resetFile}>Remove File</button>
          </div>
        )}
        */}
        <label htmlFor="file-upload" className="custom-file-upload mt-3 ml-3">
          Update Excel here
        </label>
        <input
          type="file"
          id="file-upload"
          className="fileip form-control mt-4 ml-3 mr-3"
          placeholder="Update Excel here"
          //onChange={this.handleChange}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

export default ExcelReaderForPay;

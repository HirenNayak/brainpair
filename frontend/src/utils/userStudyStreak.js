import { useState, useEffect } from "react";
import {doc, getDoc, setDoc} from "firebase/firestore";
import { auth, db, firebaseTimestamp} from "../firebase/firebase-config";


import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDocFromServer,
  Firestore
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Project } from '../types/project';
import { INITIAL_PROJECTS } from '../data/initialData';

// Initialize Firebase App instance safely
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// CRITICAL: Initialize Firestore with the exact firestoreDatabaseId from config
export const db: Firestore = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or starting up.');
    }
    return false;
  }
}

const PROJECTS_COLLECTION = 'projects';

// Real-time listener for projects with local fallback
export function subscribeToProjects(
  onUpdate: (projects: Project[]) => void,
  onError?: (err: Error) => void
): () => void {
  const collectionRef = collection(db, PROJECTS_COLLECTION);

  const unsubscribe = onSnapshot(
    collectionRef,
    (snapshot) => {
      const items: Project[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          code: data.code || `SDNU-${docSnap.id.slice(0, 4)}`,
          name: data.name || 'โครงการพัฒนาหอพัก',
          category: data.category || 'ปรับปรุงและซ่อมบำรุง',
          location: data.location || 'พื้นที่หอพักบุคลากร',
          fiscalYear: Number(data.fiscalYear) || 2568,
          budget: Number(data.budget) || 0,
          disbursedBudget: Number(data.disbursedBudget) || 0,
          fundingSource: data.fundingSource || 'งบประมาณแผ่นดิน',
          status: data.status || 'ศึกษาความเหมาะสม (Feasibility)',
          progressPercent: Number(data.progressPercent) || 0,
          targetStartDate: data.targetStartDate,
          targetEndDate: data.targetEndDate,
          responsibleUnit: data.responsibleUnit || 'กองอาคารสถานที่และยานพาหนะ',
          contractor: data.contractor,
          description: data.description,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        });
      });
      onUpdate(items);
    },
    (error) => {
      console.error('Failed to listen to projects collection:', error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, PROJECTS_COLLECTION);
    }
  );

  return unsubscribe;
}

// Seed initial projects into Firestore if empty
export async function seedInitialProjectsIfEmpty(): Promise<boolean> {
  try {
    const colRef = collection(db, PROJECTS_COLLECTION);
    const existing = await getDocs(colRef);
    if (existing.empty) {
      for (const item of INITIAL_PROJECTS) {
        const newDocRef = doc(colRef);
        await setDoc(newDocRef, {
          ...item,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error seeding initial projects:', error);
    return false;
  }
}

// Add project
export async function addProjectToFirestore(project: Omit<Project, 'id'>): Promise<string> {
  const colRef = collection(db, PROJECTS_COLLECTION);
  const newDocRef = doc(colRef);
  try {
    await setDoc(newDocRef, {
      ...project,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return newDocRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${PROJECTS_COLLECTION}/${newDocRef.id}`);
  }
}

// Update project
export async function updateProjectInFirestore(id: string, updates: Partial<Project>): Promise<void> {
  const docRef = doc(db, PROJECTS_COLLECTION, id);
  try {
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${PROJECTS_COLLECTION}/${id}`);
  }
}

// Delete project
export async function deleteProjectFromFirestore(id: string): Promise<void> {
  const docRef = doc(db, PROJECTS_COLLECTION, id);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${PROJECTS_COLLECTION}/${id}`);
  }
}

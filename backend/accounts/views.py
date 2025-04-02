from rest_framework import generics,status
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import * 
from .serializers import *

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainSerializer


class TeacherView(generics.CreateAPIView):
    serializer_class=TeacherSerializer
    permission_classes=[AllowAny]

    def create(self,request,*args,**kwargs):
        payload=request.data
        user=User.objects.get(username=payload['username'])
        teacher_id=payload['teacher_id']
        qualification=payload['qualification']
        Teacher.objects.create(user=user,teacher_id=teacher_id,qualification=qualification)
        return Response({"message":"Created Successfully"},status=status.HTTP_201_CREATED)
    
class TeacherListView(generics.ListAPIView):
    queryset=Teacher.objects.all()
    serializer_class=TeacherListSerializer                                      
    permission_classes=[AllowAny]
    
        

class StudentProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = StudentSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        return get_object_or_404(Student, user=self.request.user)

    def patch(self, request, *args, **kwargs):
        student = self.get_object()
        serializer = self.get_serializer(student, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    

class UserRetrieveView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user=self.request.user
        user_id=user.id  
        return get_object_or_404(User, id=user_id)
    

class TeacherProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = TeacherSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        return get_object_or_404(Teacher, user=self.request.user)

    def patch(self, request, *args, **kwargs):
        teacher = self.get_object()
        serializer = self.get_serializer(teacher, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
class UserTeacherListView(generics.ListAPIView):
    queryset = User.objects.filter(role='teacher')
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

# class AuthorityStudentView(generics.ListAPIView):
#     serializer_class = 

class StudentDetailView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    lookup_field = "id"

    def get_object(self):
        id = self.kwargs['id']
        student=Student.objects.get(id=id)
        return User.objects.get(username=student.user.username)


